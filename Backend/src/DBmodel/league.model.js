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
    type: {
        type: String,
        enum: ["public", "private"],
        required: true,
        default: "private"
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    ownerName:{
        type:String,
        required: true,
        ref : "User"
    },
    lifelinePerUser: {
        type: Number,
        default: 1
    },
    maxTimeTeamSelect: {
        type: Number,
        default: 1
    },
    participantsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    participantsNames: [{
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
    joinfee: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const League = mongoose.model("League", leagueSchema);

export default League;
