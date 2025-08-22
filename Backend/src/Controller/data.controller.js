// ===========================
// Import Dependencies & Models
// ===========================
import cron from "node-cron"; // For scheduled background tasks
import LeagueData from "../DBmodel/league.data.model.js";

// ===========================
// Controller: getmatch
// ===========================
export const getmatch = async (req, res) => {
  try {
    const { date } = req.query;

    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBAL_API,
        },
      }
    );

    const data = await response.json();

    const matches = (data.matches || []).map((match) => ({
      home: match.homeTeam.name,
      home_png: match.homeTeam.crest,
      away: match.awayTeam.name,
      away_png: match.awayTeam.crest,
      startTime: match.utcDate,
    }));

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch matches: " + error });
  }
};

// ===========================
// Controller: dataofdaywinner
// ===========================
export const dataofdaywinner = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBAL_API,
        },
      }
    );

    const data = await response.json();

    const winner = (data.matches || [])
      .map((match) => {
        if (match.status !== "FINISHED") return null;

        const winType = match.score.winner;

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
      })
      .filter(Boolean);

    if (!winner || winner.length === 0) {
      return res.status(200).json({ message: "No finished matches today." });
    }

    const leagues = await getLeaguesByWinners(winner);
    return res.status(200).json(leagues);
  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ error: "Something went wrong: " + error });
  }
};

// ===========================
// Helper: getLeaguesByWinners
// ===========================
const getLeaguesByWinners = async (winners) => {
  const results = [];
  const allLeagues = await LeagueData.find({ result: "pending" }).sort({
    createdAt: -1,
  });

  for (const league of allLeagues) {
    let updated = false;

    for (const team of league.teams) {
      const selectedTeam = team.teamName;
      const teamDate = new Date(team.day).toISOString().slice(0, 10);

      const possibleMatches = winners.filter(
        (w) => new Date(w.startDate).toISOString().slice(0, 10) === teamDate
      );

      if (!possibleMatches.length) continue;

      const match = possibleMatches.find(
        (w) =>
          w.winnerteam?.trim() === selectedTeam.trim() ||
          w.losserteam?.trim() === selectedTeam.trim()
      );

      // ✅ Safe checkpoint check
      if (
        league.checkPoint &&
        new Date(league.checkPoint).getTime() ===
          new Date(match.startDate).getTime()
      ) {
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
      } else if (selectedTeam.trim() === match.winnerteam?.trim()) {
        league.win += 1;
        updated = true;
      } else {
        league.loss += 1;
        updated = true;
      }

      league.checkPoint = new Date(match.startDate);
    }

    if (updated) {
      await league.save();
      results.push(league);
    }
  }

  return results;
};

// ===========================
// Match Specific Job Scheduler (Fixed)
// ===========================
let matchStartTimes = [];
const delays = [85, 90, 92, 95];

const runJob = async () => {
  console.log("⏱️ Running scheduled update job (UTC)...");
  await dataofdaywinner({}, {
    status: (code) => ({
      json: (data) => console.log(`Status: ${code}`, data),
    }),
  });
};

const scheduleJobsInUTC = () => {
  if (!matchStartTimes.length) {
    console.log("⚠️ No match times available to schedule jobs.");
    return;
  }

  for (const time of matchStartTimes) {
    const [hour, minute] = time.split(":").map(Number);

    for (const delay of delays) {
      const baseTime = new Date(Date.UTC(2025, 0, 1, hour, minute));
      const runTime = new Date(baseTime.getTime() + delay * 60000);

      const runHour = runTime.getUTCHours();
      const runMinute = runTime.getUTCMinutes();

      const cronExp = `${runMinute} ${runHour} * * *`;

      cron.schedule(cronExp, runJob, { timezone: "UTC" });

      console.log(
        `✅ Scheduled (UTC) at ${cronExp} for match ${time} + ${delay}min`
      );
    }
  }
};

// ===========================
// CRON Job: Daily Match Fetching
// ===========================
cron.schedule(
  "1 0 * * *",
  async () => {
    console.log("⚽ CRON getmatch triggered");

    const currentDate = new Date().toISOString().split("T")[0];
    const req = { query: { date: currentDate } };

    const res = {
      status: (code) => ({
        json: (data) => {
          matchStartTimes = (data || [])
            .filter((item) => typeof item.startTime === "string")
            .map((item) => item.startTime.slice(11, 16));

          console.log("📅 Today’s matches:", matchStartTimes);
          scheduleJobsInUTC();
        },
      }),
    };

    await getmatch(req, res);
  },
  { timezone: "UTC" }
);

// ===========================
// Initial setup (optional)
// ===========================
(async () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const req = { query: { date: currentDate } };

  const res = {
    status: (code) => ({
      json: (data) => {
        matchStartTimes = (data || [])
          .filter((item) => typeof item.startTime === "string")
          .map((item) => item.startTime.slice(11, 16));

        console.log("📅 Initial matches:", matchStartTimes);
        scheduleJobsInUTC();
      },
    }),
  };

  await getmatch(req, res);
})();
