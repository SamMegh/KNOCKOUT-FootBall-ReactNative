// Import the LeagueData model from the DB model directory
import LeagueData from "../DBmodel/league.data.model.js";

// ===========================
// Controller: getmatch
// ===========================
// Fetches all matches for a given date from the football-data API
export const getmatch = async (req, res) => {
  try {
    const { date } = req.query; // Extract date from query parameter

    // Fetch match data from external API using the date
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API, // API key from env
        },
      }
    );

    const data = await response.json();

    // Transform match data into simplified format
    const matches = (data.matches || []).map(match => ({
      home: match.homeTeam.name,       // Home team name
      home_png: match.homeTeam.crest,  // Home team logo
      away: match.awayTeam.name,       // Away team name
      away_png: match.awayTeam.crest,  // Away team logo
      startTime: match.utcDate         // Match start time
    }));

    res.status(200).json(matches); // Return the formatted data
  } catch (error) {
    // Handle any errors that occur during fetch or transformation
    res.status(500).json({ message: 'Unable to fetch matches: ' + error });
  }
};

// ===========================
// Controller: dataofdaywinner
// ===========================
// Fetches matches for a fixed date, determines winners, and updates league stats
export const dataofdaywinner = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];;
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=2025-07-27`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API,
        },
      }
    );

    const data = await response.json();
    // Filter finished matches and extract winner/loser info
    const winner = (data.matches || []).map(match => {
      if (match.status !== "FINISHED") return null; // Skip unfinished matches

      const winType = match.score.winner; // "HOME_TEAM", "AWAY_TEAM", or "DRAW"
      const winnerteam =
        match[winType === "HOME_TEAM" ? "homeTeam" : "awayTeam"]?.name;
      const losserteam =
        match[winType === "HOME_TEAM" ? "awayTeam" : "homeTeam"]?.name;
      const startDate = match.utcDate;

      return {
        win: winType,
        winnerteam,
        losserteam,
        startDate,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
      };
    }).filter(Boolean); // Remove nulls

    // If no finished matches, return early
    if (!winner || winner.length === 0) {
      return res.status(200).json({ message: "No finished matches today." });
    }

    // Pass winners list to helper function that updates league stats
    const leagues = await getLeaguesByWinners(winner);
    return res.status(200).json(leagues); // Return updated leagues
  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

// ===========================
// Helper: getLeaguesByWinners
// ===========================
// Updates each league’s win/loss/draw stats based on match results

const getLeaguesByWinners = async (winners) => {
  const results = [];

  const allLeagues = await LeagueData.find({}); // Fetch all leagues

  // Iterate over each league
  for (const league of allLeagues) {
    let updated = false;
    // Iterate over each selected team in the league
    for (const team of league.teams) {
      const selectedTeam = team.teamName;
      const teamDate = new Date(team.day).toISOString().slice(0, 10); // Format to YYYY-MM-DD

      // Filter matches that occurred on the same date
      const possibleMatches = winners.filter(
        w => new Date(w.startDate).toISOString().slice(0, 10) === teamDate
      );

      if (!possibleMatches.length) continue;

      // Check if user's selected team was involved in any match that day
      const match = possibleMatches.find(w =>
        w.winnerteam.trim() === selectedTeam.trim() ||
        w.losserteam.trim() === selectedTeam.trim()
      );

      if (new Date(league.checkPoint).getTime() === new Date(match.startDate).getTime()) {
        continue;
      }
      if (!match) {
        league.loss += 1;
        updated = true;
        continue;
      } else if (selectedTeam === "Not Selected") {
        league.loss += 1;
        updated = true;
      } else if (match.win === "DRAW") {
        league.draw += 1;
        updated = true;
      } else if (selectedTeam.trim() === match.winnerteam.trim()) {
        league.win += 1;
        updated = true;
      } else {
        league.loss += 1;
        updated = true;
      }
      league.checkPoint = new Date(match.startDate);
    }

    // Save league if any update was made
    if (updated) {
      // Update last checkpoint
      await league.save();             // Save changes
      results.push(league);            // Add to response list
    }
  }

  return results; // Return list of updated leagues
};

// ===========================
// AutoUpdate: leagues data
// ===========================
// Updates each league’s win/loss/draw stats based on match results
import cron from "node-cron";


// CRON: Run daily at 12:01 AM UTC to fetch matches

cron.schedule('1 0 * * *', async () => {
  console.log('⚽ CRON getmatch triggered');

  const currentDate = "2025-07-27";

  const req = {
    query: {
      date: currentDate
    }
  };

  const res = {
    status: (code) => ({
      json: (data) => {
        // ✅ Fill global matchStartTimes AFTER async completes
        matchStartTimes = (data || [])
          .filter(item => typeof item.startTime === 'string')
          .map(item => item.startTime.slice(11, 16));

        // You can now call something like scheduleJobsFromTimes(matchStartTimes) here
      }
    })
  };

  await getmatch(req, res);
}, {
  timezone: "UTC"
});


// Match start times in UTC
let matchStartTimes = [];
console.log(matchStartTimes);
const delays = [85, 90, 92, 95]; // in minutes

const runJob = async () => {
  console.log("⏱️ Running scheduled update job (UTC)...");
  await dataofdaywinner({}, {
    status: (code) => ({
      json: (data) => console.log(`Status: ${code}`, data),
    }),
  });
};

const scheduleJobsInUTC = () => {
  for (const time of matchStartTimes) {
    const [hour, minute] = time.split(":").map(Number);

    for (const delay of delays) {
      const baseTime = new Date(Date.UTC(2025, 0, 1, hour, minute)); // dummy date
      const runTime = new Date(baseTime.getTime() + delay * 60000);

      const runHour = runTime.getUTCHours();
      const runMinute = runTime.getUTCMinutes();

      const cronExp = `${runMinute} ${runHour} * * *`;

      cron.schedule(cronExp, runJob, {
        timezone: "UTC",
      });

      console.log(`✅ Scheduled (UTC) at ${cronExp} for match ${time} + ${delay}min`);
    }
  }
};

scheduleJobsInUTC();
