import bcrypt from 'bcryptjs';
import User from '../DBmodel/user.db.model.js';
import { generatorToken } from '../lib/tokenGenerator.jwt.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be atleast 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'email already exists ' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        if (newUser) {
            const token = generatorToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                user:{id: newUser._id,
                name: newUser.name,
                email: newUser.email,},
                token
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(401).json({ message: 'All fields are required' });
        }
        const loguser = await User.findOne({ email });
        if (!loguser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, loguser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = generatorToken(loguser._id, res);
        res.status(200).json({
            user: {
                _id: loguser._id,
                name: loguser.name,
                email: loguser.email,
            },
            token
        });

    } catch (error) {
        res.status(500).json({ message: 'User Not Found. Try Again!' + error });
    }

};
