
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
    }));
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch matches: ' + error });
  }
};

export const dataofapi= async(req, res)=>{
  try {
    const date = "2025-07-20"
    const data = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          'X-Auth-Token': process.env.FOOTBAL_API,
        },
      }
    );
    const d = await data.json()
    res.status(200).json(d);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch data: ' + error });
  }
}