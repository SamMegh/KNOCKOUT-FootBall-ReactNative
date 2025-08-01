// ==========================================
// 🚀 Imports & Dependencies
// ==========================================
import bcrypt from 'bcryptjs'; // 🔐 For hashing and comparing passwords
import User from '../DBmodel/user.db.model.js'; // 👤 MongoDB User model
import { generatorToken } from '../lib/tokenGenerator.jwt.js'; // 🪙 JWT generator


// ==========================================
// 📝 User Sign Up Controller
// ==========================================
export const signup = async (req, res) => {
    const { name, userName, firstName, DOB, lastName, email, password } = req.body;

    try {
        // 🚫 Validate required fields
        if (!name || !email || !userName || !password) {
            return res.status(400).json({ message: '🚨 All fields are required!' });
        }

        // 📏 Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ message: '🔐 Password must be at least 6 characters long!' });
        }

        // 📏 Validate userName length
        if (userName.length < 3) {
            return res.status(400).json({ message: '📛 userName must be at least 3 characters long!' });
        }

        // 🔍 Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '📧 Email already registered!' });
        }

        // 🔐 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 👤 Create new user object
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            userName: userName.toLowerCase(),
            firstName,
            DOB,
            SCoin: 20,
            GCoin,
            lastName,
            coinTransactions: {
                amount: 20,
                type: "earn",
                coinType: "SCoin",
                description: "Sign-up Bonus"
            }
        });

        if (newUser) {
            // 🪙 Generate JWT token
            const token = generatorToken(newUser._id, res);

            // 💾 Save user to DB
            await newUser.save();

            // ✅ Send response with user data (no password!)
            res.status(201).json({
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    userName: newUser.userName,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    DOB: newUser.DOB,
                    SCoin: newUser.SCoin,
                    GCoin: newUser.GCoin,
                    coinTransactions: newUser.coinTransactions
                },
                token
            });
        } else {
            res.status(400).json({ message: '❌ Invalid user data. Please try again.' });
        }

    } catch (error) {
        // 💥 Catch unexpected server errors
        res.status(500).json({ message: '🔥 Internal server error: ' + error });
    }
};


// ==========================================
// 🔐 User Login Controller
// ==========================================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🔎 Check for missing credentials
        if (!email || !password) {
            return res.status(401).json({ message: '📝 All fields are required!' });
        }

        // 📧 Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: '❌ Invalid email or password' });
        }

        // 🔑 Compare password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Invalid email or password' });
        }

        // 🪙 Generate auth token
        const token = generatorToken(user._id, res);

        // 🎯 Send back user info and token
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                DOB: user.DOB,
                SCoin: user.SCoin,
                GCoin: user.GCoin,
                coinTransactions: user.coinTransactions
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: '⚠️ Something went wrong! ' + error });
    }
};


// ==========================================
// 👤 Authenticated User Checker
// ==========================================
// Used to confirm identity and fetch user data via middleware
export const check = async (req, res) => {
    try {
        const user = req.user; // Set by JWT middleware
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "🔍 Unable to verify user: " + error });
    }
};


// ==========================================
// 🆔 Check If userName Exists
// ==========================================
export const checkusername = async (req, res) => {
    try {
        const { userName } = req.body;

        // ⚠️ Validate input
        if (!userName) {
            return res.status(400).json({ message: '🚨 userName is required!' });
        }
        if (userName.length < 3) {
            return res.status(400).json({ message: '📛 userName must be at least 3 characters long!' });
        }

        // 🔍 Check for existing usernames (case-insensitive, partial match)
        const response = await User.find({
            userName: { $regex: `^${userName.toLowerCase()}`, $options: "i" }
        });

        if (response.length > 0) {
            return res.status(400).json({ message: "❌ userName already exists", response });
        }

        // ✅ Available
        res.status(200).json({ message: "✅ Good to go" });

    } catch (error) {
        res.status(500).json({ message: "🔍 Unable to check the userName: " + error });
    }
};
