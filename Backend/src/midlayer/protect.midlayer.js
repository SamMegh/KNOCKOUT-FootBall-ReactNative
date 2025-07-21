import jwt from 'jsonwebtoken'
import User from "../DBmodel/user.db.model.js"

export const protection = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader|| !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "unauthroized access: no token provided" });
    }
    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ message: "unauthroized access: invalid token provided" });
    }
    const loginUser = await User.findById(decode.localId).select('-password');
    if (!loginUser) {
      return res.status(401).json({ message: 'user not found' });
    }
    req.user = loginUser;
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error" + error });
  }
}