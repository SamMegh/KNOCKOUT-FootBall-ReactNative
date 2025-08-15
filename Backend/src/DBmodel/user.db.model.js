import mongoose from 'mongoose';

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // Full name (can be used as display name)
    name: {
        type: String,
        required: true
    },

    // User's mobile number (must be unique)
    mobile: {
        type: Number,
        required: true,
        unique: true
    },


    // User email (must be unique and required)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Indicates whether email has been verified
    isMobileverified: {
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

    coinClams: {
        type: Date
    },
    // Gold Coin (can be used for premium features, paid games, etc.)
    GCoin: {
        type: Number,
        default: 0,
        min: 0 // Cannot go below 0
    },
    coinTransactions: [{
        amount: { type: Number, required: true, min: 1 }, // lowercase for consistency
        freeSCoin: { type: Number, default: 0 },
        payAmount: { type: Number, default: 0 },
        type: {
            type: String,
            enum: ["credit", "spend", "reward", "refund"],
            required: true
        },
        coinType: {
            type: String,
            enum: ["SCoin", "GCoin"],
            required: true
        },
        description: { type: String, trim: true },
        paymentId: {
            type: String,
            trim: true,
            required: true,   // Ensures every coin transaction has a payment ID
            unique: true      // Optional: prevents duplicate Stripe PaymentIntent IDs
        },
        transactionId: {
            type: String,
            required: true,     // ensures every transaction has an ID
            unique: true,       // prevents duplicate transaction IDs
            trim: true
        },
        date: { type: Date, default: Date.now }
    }]
},
    {
        // Automatically manage createdAt and updatedAt timestamps
        timestamps: true
    });

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
