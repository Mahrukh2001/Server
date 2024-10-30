const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const { tokenBlacklist } = require('../config/jwt');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (user.userTypeId == 3) return res.status(403).json({ message: 'Forbidden' });
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: 'Invalid Credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { login };

const logout = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) res.status(400).json({ message: 'No token provided' });
    
    tokenBlacklist.add(token);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const setUpdatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.userTypeId === 3) return res.status(403).json({ message: 'Forbidden' });

    // Compare the provided old password with the stored one
    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidOldPassword) return res.status(401).json({ message: 'Invalid old password' });

    
    user.oldPassword = user.password; 
    user.password = newPassword; 
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login, logout, setUpdatePassword };