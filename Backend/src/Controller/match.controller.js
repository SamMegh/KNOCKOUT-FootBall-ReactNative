
export const getmatches = async (req, res) => {
  try {
    const { date } = req.query;
    const response = await fetch(
      `https://api.football-data.org/v4/matches?date=${date}`,
      {
        headers: {
          'X-Auth-Token': '6420e902ac81458f9c129ecbace43829',
        },
      }
    );

    const data = await response.json();
    res.status(200).json(data.matches);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch matches: ' + error.message });
  }
};
