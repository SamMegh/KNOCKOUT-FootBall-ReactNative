import League from "../DBmodel/league.model.js";

export const getleague = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
    }
}
export const createleague = async (req, res) => {
    try {
        let totalWeeks = 1;
        // const {name, joinfee,maxTeam,end,start,paticipantsNames,paticipantsId,maxTimeTeamSelect,lifelinePerUser,totalWeeks}=req.body;
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
                paticipantsId: newLeague.paticipantsId,
                maxTimeTeamSelect: newLeague.maxTimeTeamSelect,
                lifelinePerUser: newLeague.lifelinePerUser,
                totalWeeks: newLeague.totalWeeks

            })
        }
    } catch (error) {
        console.log(error)
    }
}
export const joinleague = async (req, res) => {
    try {

    } catch (error) {
        console.log(error)
    }
}