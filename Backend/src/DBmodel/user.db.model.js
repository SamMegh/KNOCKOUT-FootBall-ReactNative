import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    LastName: {
        type: String
    },
    userName: {
        type: String,
        unque: true
    },
    Mobile: {
        type: String,
        unque: true
    },
    DOB: {
        type: Date
    },
    email: {
        type: String,
        required: true,
        unque: true
    },
    isEmailverified:{
        type: Boolean,
        default:false
    },
    password: {
        type: String,
        required: true,
        minLenght: 6
    },
    SCoin: {
        type: Number,
        default: 0,
        min: 0
    },
    GCoin: {
        type: Number,
        default: 0,
        min: 0
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;