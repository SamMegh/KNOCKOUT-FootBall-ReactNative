import jwt from 'jsonwebtoken';
import User from '../DBmodel/user.db.model.js';
export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.JWT
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access: no token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const user = await User.findById(decoded.userid).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'user not found' });
        }
        req.user = user;
        next();


    } catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
}