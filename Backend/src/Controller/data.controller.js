// ===========================
// Import Dependencies & Models
// ===========================

// Import the LeagueData model from the DB model directory
import cron from "node-cron"; // For scheduled background tasks
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
          'X-Auth-Token': process.env.FOOTBAL_API, // API key from environment
        },
      }
    );

    const data = await response.json();

    // Transform match data into simplified format for frontend consumption
    const matches = (data.matches || []).map(match => ({
      home: match.homeTeam.name,        // Home team name
      home_png: match.homeTeam.crest,   // Home team logo
      away: match.awayTeam.name,        // Away team name
      away_png: match.awayTeam.crest,   // Away team logo
      startTime: match.utcDate          // Match start time (UTC)
    }));

    // Respond with simplified match list
    res.status(200).json(matches);
  } catch (error) {
    // Handle API errors gracefully
    res.status(500).json({ message: 'Unable to fetch matches: ' + error });
  }
};

// ===========================
// Controller: dataofdaywinner
// ===========================
// Fetches matches for a fixed date, determines winners, and updates league stats
export const dataofdaywinner = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0]; // Today's date
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`, // Hardcoded date for now
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API, // Auth token
        },
      }
    );

    const data = await response.json();
    // Extract winner/loser info from finished matches
    const winner = (data.matches || []).map(match => {
      if (match.status !== "FINISHED") return null; // Skip ongoing/upcoming matches

      const winType = match.score.winner; // Can be "HOME_TEAM", "AWAY_TEAM", or "DRAW"

      const winnerteam =
        match[winType === "HOME_TEAM" ? "homeTeam" : "awayTeam"]?.name;
      const losserteam =
        match[winType === "HOME_TEAM" ? "awayTeam" : "homeTeam"]?.name;

      return {
        win: winType,
        winnerteam,
        losserteam,
        startDate: match.utcDate,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
      };
    }).filter(Boolean); // Remove null values

    // No finished matches case
    if (!winner || winner.length === 0) {
      return res.status(200).json({ message: "No finished matches today." });
    }

    // Update leagues based on match results
    const leagues = await getLeaguesByWinners(winner);
    return res.status(200).json(leagues);
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

  const allLeagues = await LeagueData.find({ result: "pending" }).sort({ createdAt: -1 });// Get all saved leagues

  for (const league of allLeagues) {
    let updated = false;

    for (const team of league.teams) {
      const selectedTeam = team.teamName;
      const teamDate = new Date(team.day).toISOString().slice(0, 10); // Extract date string

      // Get matches that occurred on the team’s selected day
      const possibleMatches = winners.filter(
        w => new Date(w.startDate).toISOString().slice(0, 10) === teamDate
      );

      if (!possibleMatches.length) continue;

      // Check if the team was involved in any match
      const match = possibleMatches.find(w =>
        w.winnerteam.trim() === selectedTeam.trim() ||
        w.losserteam.trim() === selectedTeam.trim()
      );

      // Skip if already processed this date
      if (new Date(league.checkPoint).getTime() === new Date(match.startDate).getTime()) {
        continue;
      }

      // Update stats based on match result
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

      // Save latest checkpoint to avoid repeat updates
      league.checkPoint = new Date(match.startDate);
    }

    // Save only if changes were made
    if (updated) {
      await league.save();
      results.push(league);
    }
  }

  return results; // Return all updated league records
};

// ===========================
// CRON Job: Daily Match Fetching
// ===========================
// Automatically fetches match data at 12:01 AM UTC
cron.schedule('1 0 * * *', async () => {
  console.log('⚽ CRON getmatch triggered');

  const currentDate = new Date().toISOString().split("T")[0];

  const req = {
    query: {
      date: currentDate
    }
  };

  // Mock response object to extract match times
  const res = {
    status: (code) => ({
      json: (data) => {
        // Extract match start times for future CRON jobs
        matchStartTimes = (data || [])
          .filter(item => typeof item.startTime === 'string')
          .map(item => item.startTime.slice(11, 16)); // Get HH:MM

        // At this point, you can dynamically schedule match-specific jobs
      }
    })
  };
console.log(matchStartTimes);
  await getmatch(req, res);
}, {
  timezone: "UTC"
});

// ===========================
// Match Specific Job Scheduler
// ===========================

let matchStartTimes = []; // Holds today's match start times in UTC (HH:MM format)
const delays = [85, 90, 92, 95]; // Delays after start time to trigger updates

// Function that runs league updates
const runJob = async () => {
  console.log("⏱️ Running scheduled update job (UTC)...");
  await dataofdaywinner({}, {
    status: (code) => ({
      json: (data) => console.log(`Status: ${code}`, data),
    }),
  });
};

// Schedule update jobs based on match times
const scheduleJobsInUTC = () => {
  for (const time of matchStartTimes) {
    const [hour, minute] = time.split(":").map(Number);

    for (const delay of delays) {
      // Create a dummy time and add delay
      const baseTime = new Date(Date.UTC(2025, 0, 1, hour, minute)); // Dummy date (Jan 1, 2025)
      const runTime = new Date(baseTime.getTime() + delay * 60000);

      const runHour = runTime.getUTCHours();
      const runMinute = runTime.getUTCMinutes();

      const cronExp = `${runMinute} ${runHour} * * *`;

      // Schedule job
      cron.schedule(cronExp, runJob, {
        timezone: "UTC",
      });

      console.log(`✅ Scheduled (UTC) at ${cronExp} for match ${time} + ${delay}min`);
    }
  }
};

// Initial call to setup jobs
scheduleJobsInUTC();
