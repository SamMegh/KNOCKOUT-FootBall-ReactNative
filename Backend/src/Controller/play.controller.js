import LeagueData from "../DBmodel/league.data.model.js";
import League from "../DBmodel/league.model.js";
import User from '../DBmodel/user.db.model.js';

export const getleague = async (req, res) => {
    try {
        const currentDate = new Date();
        const { userId } = req.body;
        const upcomingLeagues = await League.find({
            $or: [
                {
                    start: { $lte: currentDate },
                    end: { $gte: currentDate }
                },
                {
                    start: { $gt: currentDate }
                }
            ],
            participantsId: { $ne: userId }
        });

        res.status(200).json(upcomingLeagues);
    } catch (error) {
        res.status(500).json({
            message: "unable to get leagues" + error
        });
    }
}

export const getmyleague = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentDate = new Date();
        const upcommingLeagues = await League.find({
            end: { $gte: currentDate },
            participantsId: { $in: [userId] }
        });
        res.status(200).json(upcommingLeagues);
    } catch (error) {
        res.status(500).json({
            message: "unable to get leagues" + error
        });
    }
}

export const createleague = async (req, res) => {
    try {
        let { name, joinfee, ownerId, end, start, maxTimeTeamSelect, type, lifelinePerUser, totalWeeks } = req.body;
        // const { name, joinfee, weeks, start } = req.body;
        if (!start || !name || !joinfee || !ownerId  || (!totalWeeks && !end)) {
            return res.status(400).json({
                message: "invalid data to create a league"
            })
        }

        const owner_in_DB= await User.findById(ownerId);
        if(!owner_in_DB)return res.status(400).json("invalid user to create league")

        // Function to get next Saturday from a date
        function getNextSaturday(date, weekOffset) {
            const result = new Date(date);
            const day = result.getDay(); // 0 = Sunday, 6 = Saturday
            const daysUntilSaturday = (6 - day + 7) % 7; // Days to this Saturday
            result.setDate(result.getDate() + daysUntilSaturday + (weekOffset * 7));
            return result;
        }
        //function for finding number of weeks as per start and end 
        function getTotalWeeks(startDateStr, endDateStr) {
            const start = new Date(startDateStr);
            const end = new Date(endDateStr);

            if (isNaN(start) || isNaN(end)) {
                throw new Error("Invalid date format");
            }

            const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
            const diffInMs = end - start;

            if (diffInMs < 0) {
                throw new Error("End date must be after start date");
            }

            return Math.ceil(diffInMs / millisecondsPerWeek);
        }
        // Calculate end date based on number of weeks
        if (!end) { end = getNextSaturday(start, (totalWeeks - 1)); }

        if (!totalWeeks) { totalWeeks = getTotalWeeks(start, end) }

        const newLeague = new League({
            name, joinfee, ownerId, ownerName:owner_in_DB.name, end, start, maxTimeTeamSelect, lifelinePerUser, totalWeeks, type
        });
        if (newLeague) {
            await newLeague.save();
            res.status(200).json({
                _id: newLeague._id,
                name: newLeague.name,
                joinfee: newLeague.joinfee,
                maxTeam: newLeague.maxTeam,
                end: newLeague.end,
                start: newLeague.start,
                paticipantsNames: newLeague.participantsNames,
                participantsId: newLeague.participantsId,
                maxTimeTeamSelect: newLeague.maxTimeTeamSelect,
                lifelinePerUser: newLeague.lifelinePerUser,
                totalWeeks: newLeague.totalWeeks,
                type : newLeague.type,
                ownerId : newLeague.ownerId,
                ownerName : newLeague.ownerName

            })
        }
    } catch (error) {
        res.status(500).json({
            message: "unable to create leagues" + error
        });
    }
}

export const getMyCreatedLeagues = async (req, res) => {
    try {
        const { ownerId } = req.query;

        if (!ownerId) {
            return res.status(400).json({ message: "Missing ownerId in query" });
        }

        const created_leagues_by_me = await League.find({ ownerId: ownerId });

        res.status(200).json(created_leagues_by_me);
    } catch (error) {
        res.status(500).json({ message: "Error getting your created leagues: " + error.message });
    }
};


export const joinleague = async (req, res) => {
    try {
        const { userId, leagueId } = req.body;
        const currentDate = new Date();

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ message: "Unable to get the user" });


        const league = await League.findById(leagueId);

        if (!league || currentDate > league.end) return res.status(400).json({ message: "Unable to get the league" });

        if (league.participantsId.some(id => id.toString() === userId.toString())) return res.status(400).json({ message: "You are already in this league" });
        await _createTeam(user._id, user.name, league._id, league.name);
        const newleaguedata = await League.findByIdAndUpdate(
            leagueId,
            {
                $push: {
                    participantsId: { $each: [user._id] },
                    participantsNames: { $each: [user.name] }
                }
            },
            { new: true } // optional if you want updated doc back
        );

        res.status(200).json({
            newleaguedata
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to join league",
            error: error
        });
    }
};

const _createTeam = async (userId, userName, leagueId, leagueName) => {
    try {
        const league = await League.findById(leagueId);

        function dateformat(date) {
            const newDate = new Date(date);
            const yyyy = newDate.getFullYear();
            const mm = (newDate.getMonth() + 1).toString().padStart(2, '0');
            const dd = newDate.getDate().toString().padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        const start = new Date(league.start);
        const end = new Date(league.end);
        const allDates = new Set();

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 10)) {
            const dateFrom = dateformat(d);
            const dTo = new Date(d);
            dTo.setDate(dTo.getDate() + 9);
            if (dTo > end) dTo.setTime(end.getTime());
            const dateTo = dateformat(dTo);

            const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
                headers: {
                    'X-Auth-Token': process.env.FOOTBAL_API,
                },
            });

            const data = await response.json();

            if (!data.matches) {
                console.log(`No matches found between ${dateFrom} and ${dateTo}`);
                continue;
            }

            data.matches.forEach(match => {
                const date = match.utcDate.split('T')[0];
                allDates.add(date);
            });
        }

        const uniqueDates = [...allDates];

        if (uniqueDates.length === 0) {
            throw new Error("No matches data found in API response");
        }

        const userLeagueData = new LeagueData({
            userId,
            userName,
            leagueId,
            leagueName,
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

export const jointeam = async (req, res) => {
    try {
        const currentDate = new Date();
        const { userId, leagueId, day, teamName } = req.body;

        if (!userId || !leagueId || !day || !teamName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newDate = new Date(day);
        if (currentDate >= newDate) {
            return res.status(400).json({ message: "Invalid date to join team" });
        }

        const data = await LeagueData.findOne({ userId, leagueId });
        if (data.end <= currentDate) {
            if (data.end < currentDate) {
                return res.status(400).json({ message: "unable to join team becoues league is ended" });
            } else {
                return res.status(400).json({ message: "unable to join team becoues it is last day of the league" });
            }
        }
        if (!data) {
            return res.status(404).json({ message: "League data not found" });
        }

        if (data.teams.some(team => team.teamName === teamName)) {
            return res.status(400).json("team is already selected");
        }
        const updatedLeague = await LeagueData.findOneAndUpdate(
            { userId, leagueId, "teams.day": day },
            { $set: { "teams.$.teamName": teamName } },
            { new: true }
        );

        return res.status(200).json(updatedLeague);

    } catch (error) {
        console.error("Join Team Error:", error);
        return res.status(500).json({ message: "Unable to join the team", error: error.message });
    }
};

export const myteam = async (req, res) => {
    try {
        const { userId, leagueId } = req.body;
        if (!userId || !leagueId) return res.status(400).json({ message: "All fields are required to get the team " });
        const myteamdata = await LeagueData.findOne({ $and: [{ userId }, { leagueId }] });
        if (!myteamdata) return res.status(400).json({ message: "no team found for this league" });
        res.status(200).json(myteamdata)
    } catch (error) {
        res.status(500).json({ message: "unable to get the team " + error });
    }
}

export const teams = async (req, res) => {
    try {
        const { leagueid } = req.query;
        if (!leagueid) return res.status(400).json({ message: "leagueid query parameter is required." });
        const teams = await LeagueData.find({ leagueId: leagueid });
        res.status(200).json(teams)
    } catch (error) {
        res.status(500).json({ message: "unable to get the teams " + error });
    }
}