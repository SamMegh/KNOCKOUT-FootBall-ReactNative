// Importing required models
import LeagueData from "../DBmodel/league.data.model.js";
import League from "../DBmodel/league.model.js";
import User from '../DBmodel/user.db.model.js';

/**
 * Get public leagues that the current user hasn't joined yet.
 */
export const getleague = async (req, res) => {
    try {
        const currentDate = new Date();
        const userId = req.user._id;

        // Find leagues that are public, upcoming or ongoing, and not joined by the current user
        const upcomingLeagues = await League.find({
            $and: [
                {
                    $or: [
                        { start: { $lte: currentDate }, end: { $gte: currentDate } }, // ongoing
                        { start: { $gt: currentDate } } // upcoming
                    ]
                },
                { type: "public" },
                { participantsId: { $ne: userId } }
            ]
        });

        res.status(200).json(upcomingLeagues);
    } catch (error) {
        res.status(500).json({
            message: "Unable to get leagues: " + error
        });
    }
};

/**
 * Get leagues that the current user has already joined and are not yet finished.
 */
export const getmyleague = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();

        const upcommingLeagues = await League.find({
            end: { $gte: currentDate },
            participantsId: { $in: [userId] }
        }).sort({ start: 1 }); // Sort by starting date ascending

        res.status(200).json(upcommingLeagues);
    } catch (error) {
        res.status(500).json({
            message: "Unable to get leagues: " + error.message
        });
    }
};

/**
 * Create a new league with validations and calculated weeks/end date.
 */
export const createleague = async (req, res) => {
    try {
        const ownerId = req.user._id;
        let { name, joinfee, end, start, maxTimeTeamSelect, type, lifelinePerUser, totalWeeks } = req.body;

        // Required fields check
        if (!start || !name || !joinfee || !ownerId || (!totalWeeks && !end)) {
            return res.status(400).json({ message: "All fields are required to create a league" });
        }

        const owner_in_DB = await User.findById(ownerId);
        if (!owner_in_DB) return res.status(400).json("Invalid user to create league");

        // Utility: Get the next Saturday after given date with offset
        function getNextSaturday(date, weekOffset) {
            const result = new Date(date);
            const day = result.getDay();
            const daysUntilSaturday = (6 - day + 7) % 7;
            result.setDate(result.getDate() + daysUntilSaturday + (weekOffset * 7));
            return result;
        }

        // Utility: Calculate total weeks between two dates
        function getTotalWeeks(startDateStr, endDateStr) {
            const start = new Date(startDateStr);
            const end = new Date(endDateStr);
            const msPerWeek = 1000 * 60 * 60 * 24 * 7;
            return Math.ceil((end - start) / msPerWeek);
        }

        // Dynamically calculate missing end or totalWeeks
        if (!end) end = getNextSaturday(start, totalWeeks - 1);
        if (!totalWeeks) totalWeeks = getTotalWeeks(start, end);

        // Create and save new league
        const newLeague = new League({
            name, joinfee, ownerId, ownerName: owner_in_DB.name, end, start,
            maxTimeTeamSelect, lifelinePerUser, totalWeeks, type
        });

        await newLeague.save();

        res.status(200).json(newLeague);
    } catch (error) {
        res.status(500).json({
            message: "Unable to create league: " + error
        });
    }
};

/**
 * Get leagues created by the current user.
 */
export const getMyCreatedLeagues = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const created_leagues_by_me = await League.find({ ownerId });

        res.status(200).json(created_leagues_by_me);
    } catch (error) {
        res.status(500).json({ message: "Error getting your created leagues: " + error.message });
    }
};

/**
 * Allows a user to join a league if they haven't already.
 */
export const joinleague = async (req, res) => {
    try {
        const userId = req.user._id;
        const { leagueId } = req.body;
        const currentDate = new Date();

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: "User not found" });

        const league = await League.findById(leagueId);
        if (!league || currentDate > league.end) return res.status(400).json({ message: "Invalid or expired league" });

        if (league.participantsId.includes(userId)) return res.status(400).json({ message: "Already joined" });

        await _createTeam(user._id, user.name, league._id, league.name); // Create initial team data

        const newleaguedata = await League.findByIdAndUpdate(
            leagueId,
            {
                $push: {
                    participantsId: user._id,
                    participantsNames: user.name
                }
            },
            { new: true }
        );

        res.status(200).json(newleaguedata);

    } catch (error) {
        res.status(500).json({
            message: "Unable to join league",
            error
        });
    }
};

/**
 * Internal helper function to initialize a team for a user in a league.
 */
const _createTeam = async (userId, userName, leagueId, leagueName) => {
    try {
        const league = await League.findById(leagueId);

        // Format date into yyyy-mm-dd
        function dateformat(date) {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }

        const start = new Date(league.start);
        const end = new Date(league.end);
        const allDates = new Set();

        // Fetch match data in 10-day windows
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 10)) {
            const dateFrom = dateformat(d);
            const dTo = new Date(d);
            dTo.setDate(dTo.getDate() + 9);
            if (dTo > end) dTo.setTime(end.getTime());
            const dateTo = dateformat(dTo);

            const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
                headers: { 'X-Auth-Token': process.env.FOOTBAL_API },
            });

            const data = await response.json();
            if (!data.matches) continue;

            data.matches.forEach(match => {
                const date = match.utcDate.split('T')[0];
                allDates.add(date);
            });
        }

        const uniqueDates = [...allDates];
        if (uniqueDates.length === 0) throw new Error("No matches data found");

        // Save league data with unselected teams
        const userLeagueData = new LeagueData({
            userId,
            userName,
            leagueId,
            leagueName,
            checkPoint: new Date(),
            teams: uniqueDates.map(date => ({
                day: new Date(date),
                teamName: "Not Selected"
            }))
        });

        await userLeagueData.save();
    } catch (error) {
        console.error("Error in _createTeam:", error);
    }
};

/**
 * Allows a user to join/select a team for a given matchday.
 */
export const jointeam = async (req, res) => {
    try {
        const currentDate = new Date();
        const userId = req.user._id;
        const { leagueId, day, teamName, startTime } = req.body;

        if (!leagueId || !day || !teamName || !startTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newDate = new Date(day);
        if (currentDate >= newDate) {
            return res.status(400).json({ message: "Invalid date to join team" });
        }

        const data = await LeagueData.findOne({ userId, leagueId });

        if (!data) return res.status(404).json({ message: "League data not found" });
        if (data.lifeline === 0) return res.status(400).json({ message: "All lifelines used" });
        if (data.noSelected > 0) return res.status(400).json({ message: "Missed previous selection" });
        if (data.end <= currentDate) return res.status(400).json({ message: "League already ended" });

        if (data.teams.some(team => team.teamName === teamName)) {
            return res.status(400).json("Team already selected");
        }

        // Update selected team for the matchday
        const updatedLeague = await LeagueData.findOneAndUpdate(
            { userId, leagueId, "teams.day": day },
            {
                $set: {
                    "teams.$.teamName": teamName,
                    "teams.$.startTime": new Date(startTime)
                }
            },
            { new: true }
        );

        return res.status(200).json(updatedLeague);

    } catch (error) {
        console.error("Join Team Error:", error);
        return res.status(500).json({ message: "Unable to join the team", error: error.message });
    }
};

/**
 * Get the current user's team details for a specific league.
 */
export const myteam = async (req, res) => {
    try {
        const userId = req.user._id;
        const { leagueId } = req.body;

        if (!leagueId) return res.status(400).json({ message: "League ID required" });

        const myteamdata = await LeagueData.findOne({ userId, leagueId });
        if (!myteamdata) return res.status(400).json({ message: "No team found for this league" });

        res.status(200).json(myteamdata);
    } catch (error) {
        res.status(500).json({ message: "Unable to get the team: " + error });
    }
};

/**
 * Get all teams for a given league.
 */
export const teams = async (req, res) => {
    try {
        const { leagueid } = req.query;
        if (!leagueid) return res.status(400).json({ message: "leagueid query parameter is required." });

        const teams = await LeagueData.find({ leagueId: leagueid });
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: "Unable to get the teams: " + error });
    }
};

/**
 * Search public leagues by name that the user hasn’t joined.
 */
export const leaguebyname = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();
        const { name } = req.body;

        const leagues = await League.find({
            $and: [
                {
                    $or: [
                        { start: { $lte: currentDate }, end: { $gte: currentDate } }, // ongoing
                        { start: { $gt: currentDate } } // upcoming
                    ]
                },
                { name: { $regex: `^${name}`, $options: "i" } },
                { participantsId: { $ne: userId } }
            ]
        }).limit(6);

        res.status(200).json(leagues);
    } catch (error) {
        res.status(500).json({ message: "Unable to get the league: " + error });
    }
};
