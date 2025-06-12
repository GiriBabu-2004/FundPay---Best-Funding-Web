import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT and attach user to req
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Select only needed fields (e.g. name, email, role)
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // now includes name
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check admin role
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
