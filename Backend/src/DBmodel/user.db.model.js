import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // Full name (can be used as display name)
    name: {
        type: String,
        required: true
    },

    // Optional first name
    firstName: {
        type: String
    },

    // Optional last name
    lastName: {
        type: String
    },

    // Unique username for login/display
    userName: {
        type: String,
        required: true,
        unique: true
    },

    // User's mobile number (max 12 digits, must be unique)
    // mobile: {
    //     type: Number,
    //     maxlength: 12,
    //     required: true,
    //     unique: true
    // },

    // Optional date of birth
    DOB: {
        type: Date
    },

    // User email (must be unique and required)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Indicates whether email has been verified
    isEmailverified: {
        type: Boolean,
        default: false
    },

    // Hashed password with a minimum length of 6 characters
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    // Soft Coin (used for in-game rewards, etc.)
    SCoin: {
        type: Number,
        default: 0,
        min: 0 // Cannot go below 0
    },

    // Gold Coin (can be used for premium features, paid games, etc.)
    GCoin: {
        type: Number,
        default: 0,
        min: 0 // Cannot go below 0
    },
    coinTransactions: [{
        amount: Number,
        type: { type: String, enum: ["earn", "spend", "reward", "refund"] },
        coinType: { type: String, enum: ["SCoin", "GCoin"] },
        description: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
