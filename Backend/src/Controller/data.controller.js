import LeagueData from "../DBmodel/league.data.model.js";

export const getmatch = async (req, res) => {
  try {
    const { date } = req.query;
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API,
        },
      }
    );

    const data = await response.json();
    const matches = (data.matches || []).map(match => ({
      home: match.homeTeam.name,
      home_png: match.homeTeam.crest,
      away: match.awayTeam.name,
      away_png: match.awayTeam.crest,
      startTime: match.utcDate
    }));
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch matches: ' + error });
  }
};

export const dataofdaywinner = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=2025-07-27`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API,
        },
      }
    );

    const data = await response.json();

    const winner = (data.matches || []).map(match => {
      if (match.status !== "FINISHED") return null;

      const winType = match.score.winner;
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
    }).filter(Boolean);

    if (!winner || winner.length === 0) {
      return res.status(200).json({ message: "No finished matches today." });
    }
    const leagues = await getLeaguesByWinners(winner);
    return res.status(200).json(leagues);

  } catch (error) {
    console.error("Error fetching matches:", error);
    return res.status(500).json({ error: "Something went wrong" + error });
  }
};

const getLeaguesByWinners = async (winners) => {
  const results = [];

  const allLeagues = await LeagueData.find({});

  for (const league of allLeagues) {
    let updated = false;

    for (const team of league.teams) {
      const selectedTeam = team.teamName;
      const teamDate = new Date(team.day).toISOString().slice(0, 10);

      const possibleMatches = winners.filter(
        w => new Date(w.startDate).toISOString().slice(0, 10) === teamDate
      );

      if (!possibleMatches.length) continue;

      // Find if this user's selected team is involved in any of the matches that day
      const match = possibleMatches.find(w =>
        w.winnerteam.trim() === selectedTeam.trim() ||
        w.losserteam.trim() === selectedTeam.trim()
      );

      if (!match) {
        // If no match found for this team, assume wrong selection
        if (selectedTeam !== "Not Selected") {
          league.loss += 1;
          updated = true;
        } else {
          league.loss += 1;
          updated = true;
        }
        continue;
      }

      // Evaluate the result
      if (selectedTeam === "Not Selected") {
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
    }

    if (updated) {
  league.checkpoint = new Date();  // ✅ Update checkpoint
  await league.save();             // 💾 Save updated league
  results.push(league);            // 📦 Add to response
}
  }

  return results;
};

