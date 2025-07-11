import LeagueData from "../DBmodel/league.data.model.js";
import League from "../DBmodel/league.model.js";
import User from '../DBmodel/user.db.model.js';

export const getleague = async (req, res) => {
    try {
        const currentDate = new Date();
        const upcommingLeagues = await League.find({
            $or: [
                {
                    start: { $lte: currentDate },
                    end: { $gte: currentDate }
                },
                {
                    start: { $gt: currentDate }
                }
            ]
        });
        res.status(200).json(upcommingLeagues);
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
            start: { $gt: currentDate },
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
        let totalWeeks = 1;
        // const {name, joinfee,maxTeam,end,start,paticipantsNames,participantsId,maxTimeTeamSelect,lifelinePerUser,totalWeeks}=req.body;
        const { name, joinfee, weeks, start } = req.body;
        if (weeks <= 0) {
            return res.status(400).json({
                message: "invalid data to create a league"
            })
        }
        if (weeks) totalWeeks = weeks;


        // Function to get next Saturday from a date
        function getNextSaturday(date, weekOffset) {
            const result = new Date(date);
            const day = result.getDay(); // 0 = Sunday, 6 = Saturday
            const daysUntilSaturday = (6 - day + 7) % 7; // Days to this Saturday
            result.setDate(result.getDate() + daysUntilSaturday + (weekOffset * 7));
            return result;
        }

        // Calculate end date based on number of weeks
        let end = getNextSaturday(start, (totalWeeks - 1));

        const newLeague = new League({
            name,
            joinfee,
            end,
            start,
            totalWeeks
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
                paticipantsNames: newLeague.paticipantsNames,
                participantsId: newLeague.participantsId,
                maxTimeTeamSelect: newLeague.maxTimeTeamSelect,
                lifelinePerUser: newLeague.lifelinePerUser,
                totalWeeks: newLeague.totalWeeks

            })
        }
    } catch (error) {
        res.status(500).json({
            message: "unable to create leagues" + error
        });
    }
}

export const joinleague = async (req, res) => {
    try {
        const { userId, leagueId } = req.body;
        const currentDate = new Date();

        const user = await User.findById(userId);

        if (!user) return res.status(400).json({ message: "Unable to get the user" });


        const league = await League.findById(leagueId);

        if (!league || currentDate > league.end) return res.status(400).json({ message: "Unable to get the league" });

        if (league.participantsId.some(id => id.toString() === userId.toString())) return res.status(400).json({ message: "You are already in this league" });
        await League.findByIdAndUpdate(
            leagueId,
            {
                $push: {
                    participantsId: { $each: [user._id] },
                    participantsNames: { $each: [user.name] }
                }
            },
            { new: true } // optional if you want updated doc back
        );
        await _createTeam(user._id, user.name, league._id, league.name);
        res.status(200).json({
            message: "User added successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to join league",
            error: error.message
        });
    }
};
const _createTeam = async (userId, userName, leagueId, leagueName) => {
    try {
        const userLeagueData = new LeagueData({
            userId, userName, leagueId, leagueName
        });
        userLeagueData.save();
    } catch (error) {
        res.status(500).json({ message: "unable to create a team " + error });
    }
}
export const jointeam = async (req, res) => {
    try {
        const currentDate = new Date();
        const { userId, leagueId, day, teamName } = req.body;
        let data = await LeagueData.findOne({ userId, leagueId });
        const alreadyEver = data.teams.some(entry => entry.teamName === teamName);
        if(alreadyEver) return res.status(400).json("you previously joind this team");
        await LeagueData.findOneAndUpdate(
            {
                userId,
                leagueId
            },
            {
                $push: {
                    teams: {
                        day,
                        teamName
                    }
                }
            }
        )
res.status(200).json({
    message:"successfully added"
})
    } catch (error) {
        res.status(500).json({ message: "unable to join to team " + error });
    }
}

