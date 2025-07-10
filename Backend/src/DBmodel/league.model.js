import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    totalWeeks: {
        type: Number,
        default: 1
    },
    lifelinePerUser: {
        type: Number,
        default: 1
    },
    maxTimeTeamSelect: {
        type: Number,
        default: 1
    }, 
    paticipantsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    paticipantsNames: [{
        type: String
    }],
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    maxTeam: {
        type: Number,
        min: 1,
        max: 7,
        default: 7
    },
    joinfee: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const League = mongoose.model("League", leagueSchema);

export default League;
