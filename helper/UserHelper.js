const User = require('../models/Users');

//  EMAIL
const isValidEmail = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Utility function to check if an email already exists, excluding the given user ID if provided
const doesEmailExist = async (email, excludeUserId = null) => { 
  try {
    if (isValidEmail(email)) {
      // If an excludeUserId is provided, exclude this user from the check
      const query = excludeUserId ? { email, _id: { $ne: excludeUserId } } : { email };
      
      const user = await User.findOne(query);
      return !!user; // Returns true if a user exists with this email, false otherwise
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};


//  MOBILE #
const isValidMobileNo = contact => {
  return /^[0-9]{11}$/.test(contact); 
};

// Utility function to check if a mobile number already exists, excluding the given user ID if provided
const doesContactNoExist = async (mobileNo, excludeUserId = null) => {
  try {
    const isValidContactNo = isValidMobileNo(mobileNo);
    if (isValidContactNo) {
      // If an excludeUserId is provided, exclude this user from the check
      const query = excludeUserId ? { mobileNo, _id: { $ne: excludeUserId } } : { mobileNo };

      const user = await User.findOne(query);
      return !!user; // Returns true if a user exists with this mobile number, false otherwise
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};


//  CNIC
const isValidCnic = cnic => {
  return typeof cnic === 'string' && /^[0-9]{13}$/.test(cnic);
};

const doesCnicExist = async cnic => {
  try {
    const isValidNic = isValidCnic(cnic);
    if (isValidNic) {
      const user = await User.findOne({ cnic });
      return !!user;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { doesCnicExist, isValidCnic, isValidMobileNo, doesContactNoExist, isValidEmail, doesEmailExist };