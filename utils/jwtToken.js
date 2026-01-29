// utils/jwtToken.js
import jwt from 'jsonwebtoken';

export const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};
