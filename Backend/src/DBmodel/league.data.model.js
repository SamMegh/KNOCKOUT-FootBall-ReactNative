import mongoose from "mongoose";

const teamEntrySchema = new mongoose.Schema({
  day: {
    type: Date,
  },
  startTime: {
    type: Date,
  },
  teamName: {
    type: String,
    default: "Not Selected"
  }
});

const leagueDataSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  leagueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true
  },
  leagueName: {
    type: String,
    required: true
  },
  win: {
    type: Number,
    default: 0
  },
  loss: {
    type: Number,
    default: 0
  },
  draw: {
    type: Number,
    default: 0
  },
  result:{
    type:String,
    enum:['win','loss','pending'],
    default:"pending"
  },
  checkPoint:{
    type:Date
  },
  lifeline: {
    type: Number,
    default: 1
  },
  teams: [teamEntrySchema]
}, {
  timestamps: true
});

const LeagueData = mongoose.model("LeagueData", leagueDataSchema);

export default LeagueData;
