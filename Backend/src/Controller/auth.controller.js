// ===============================
// 👀 Imports & Dependencies
// ===============================
import bcrypt from 'bcryptjs'; // For hashing and verifying passwords 🔐
import User from '../DBmodel/user.db.model.js'; // MongoDB model for storing users 🧠
import { generatorToken } from '../lib/tokenGenerator.jwt.js'; // JWT creator function 🎟️


// ===============================
// 📝 Sign Up Controller
// ===============================
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // ⚠️ Field validation — no blanks allowed!
        if (!name || !email || !password) {
            return res.status(400).json({ message: '🚨 All fields are required!' });
        }

        // 📏 Enforce strong(ish) password policy
        if (password.length < 6) {
            return res.status(400).json({ message: '🔐 Password must be at least 6 characters long!' });
        }

        // 🔍 Check if this email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '📧 Email already registered!' });
        }

        // 🔧 Secure the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🆕 Create new user instance
        const newUser = new User({ name, email, password: hashedPassword });

        if (newUser) {
            // 🪙 Generate JWT token & set cookies if needed
            const token = generatorToken(newUser._id, res);

            // 💾 Save to DB
            await newUser.save();

            // 🎉 Send success response
            res.status(201).json({
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                token
            });
        } else {
            res.status(400).json({ message: '❌ Invalid user data. Please try again.' });
        }

    } catch (error) {
        // 🧯 Catch unexpected fires
        res.status(500).json({ message: '🔥 Internal server error: ' + error });
    }
};


// ===============================
// 🔑 Login Controller
// ===============================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 🚫 Don’t allow missing credentials
        if (!email || !password) {
            return res.status(401).json({ message: '📝 All fields are required!' });
        }

        // 🔍 Look up user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '❌ Invalid email or password' });
        }

        // 🔐 Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Invalid email or password' });
        }

        // 🎟️ Generate auth token on successful login
        const token = generatorToken(user._id, res);

        // 🎯 Return user details and token
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: '⚠️ Something went wrong! ' + error });
    }
};


// ===============================
// ✅ Check Current User
// ===============================
export const check = async (req, res) => {
    try {
        // 🔐 req.user should be attached by auth middleware
        const user = req.user;
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "🔍 Unable to verify user: " + error });
    }
};
