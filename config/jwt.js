const jwt = require('jsonwebtoken');
const tokenBlacklist = new Set();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (tokenBlacklist.has(token)) return res.status(401).json({ message: 'Token is invalid, please log in again.' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const verifyTokenFunc = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (tokenBlacklist.has(token)) return res.status(401).json({ message: 'Token is invalid, please log in again.' });

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const authenticate = async (req, res, next) => {
  const userTypeId = req.params.userTypeId;

  if (userTypeId != 3) return verifyTokenFunc(req, res, next);
  next();
};

module.exports = { verifyToken, verifyTokenFunc, authenticate, tokenBlacklist };