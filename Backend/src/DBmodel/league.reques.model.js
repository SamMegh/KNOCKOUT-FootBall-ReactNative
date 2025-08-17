import mongoose from 'mongoose';
const requestSchema= new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        ref:"User"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    leagueId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"League"
    },
    status:{
        type:String,
        required: true,
        enum:["pending","accept","reject"],
        default:"pending"
    },
    joinfee: {
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        type: {
            type: String,
            enum: ["GCoin", "SCoin"],
            default:"SCoin",
            required: true
        }
    }
},{
  timestamps:true  
});
export const Request=mongoose.model("Request",requestSchema);