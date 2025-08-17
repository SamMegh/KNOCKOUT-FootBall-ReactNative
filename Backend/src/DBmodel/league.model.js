import mongoose from 'mongoose';

/**
 * ============================
 * 📦 League Schema Definition
 * ============================
 * Represents a fantasy league configuration including:
 * - Ownership
 * - Access type (public/private)
 * - Lifelines, duration
 * - Join fee (SCoin / GCoin)
 * - Participants & scheduling
 */

const leagueSchema = new mongoose.Schema({

    /** 🏷️ League Name (e.g., "Premier Knockout") */
    name: {
        type: String,
        required: true
    },

    /** 🗓️ Total number of weeks the league spans */
    totalWeeks: {
        type: Number,
        default: 1
    },

    /** 🔒 Access type of league: "public" (anyone can join) or "private" (invite only) */
    type: {
        type: String,
        enum: ["public", "private"],
        default: "private",
        required: true
    },

    /** 👤 MongoDB ObjectId of the user who created this league */
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    /** ✏️ Creator's name (stored for quick access/display) */
    ownerName: {
        type: String,
        required: true
    },

    /** ❤️ Lifelines each user gets (used for retries, special powers, etc.) */
    lifelinePerUser: {
        type: Number,
        default: 1
    },

    /** ⏱️ Max time (in hours or days) allowed for team selection per match/week */
    maxTimeTeamSelect: {
        type: Number,
        default: 1
    },

    /** 🧑‍🤝‍🧑 List of participant IDs (users who joined this league) */
    participantsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    /** 📛 Optional list of participant names (used for quick display) */
    participantsNames: [{
        type: String
    }],

    /** 🚀 League start date and time */
    start: {
        type: Date,
        required: true
    },

    /** 🏁 League end date and time */
    end: {
        type: Date,
        required: true
    },

    /**
     * 💰 Join Fee Structure
     * - amount: Number of coins required to join
     * - type: Either "GCoin" (premium) or "SCoin" (soft/free coins)
     */
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

}, {
    /** 🕒 Automatically adds createdAt and updatedAt timestamps */
    timestamps: true
});

/** 📘 League Model based on leagueSchema */
const League = mongoose.model("League", leagueSchema);

export default League;
