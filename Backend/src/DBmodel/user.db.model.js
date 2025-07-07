import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    unque: true
    },
    password: {
        type: String,
        required: true,
    minLenght: 6
    },
},
{
    timestamps: true
}
);

const User = mongoose.model('User', userSchema);

export default User;