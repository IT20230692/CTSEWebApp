import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';

export const verifyToken = (req, res, next) => {
  // Using optional chaining to simplify the check
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(createError(401, 'You are not authenticated!'));
  }

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(createError(403, 'Token is not valid!'));
    }
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
