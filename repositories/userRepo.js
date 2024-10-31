const User = require('../models/Users');
const { doesCnicExist, doesEmailExist, doesContactNoExist, isValidCnic, isValidMobileNo, isValidEmail } = require('../helper/UserHelper');
const path = require("path");
const fs = require("fs");

// Create User
const createUser = async (req, res) => {
  try {
    const userTypeId = req.params.userTypeId;
    const cnic = req.body.cnic;
    const email = req.body.email;
    const mobileNo = req.body.mobileNo;

    const cnicRegistered = await doesCnicExist(cnic);
    const emailExists = await doesEmailExist(email);
    const mobileNoExists = await doesContactNoExist(mobileNo);

    if (cnicRegistered) return res.status(400).json({ message: 'CNIC is already Registered'});
    if (emailExists) return res.status(400).json({ message: 'Email is already Registered'});
    if (mobileNoExists) return res.status(400).json({ message: 'Mobile Number is already Registered'});
  
    const user = new User({
      ...req.body,
      userTypeId: userTypeId,
      isActive: true
    });

    await user.save();
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const userTypeId = req.params.userTypeId;
    const users = await User.find({ isActive: true, userTypeId: userTypeId });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId, isActive: true });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { cnic, email, mobileNo } = req.body;

  try {
    console.log("Incoming request body:", req.body); // Log incoming data

    const user = await User.findOne({ _id: userId, isActive: true });
    if (!user) {
      console.log("User not found or not active");
      return res.status(404).json({ message: 'User not found or not active' });
    }

    // Validate fields
    if (cnic && !isValidCnic(cnic)) return res.status(400).json({ message: 'Invalid CNIC' });
    if (email && !isValidEmail(email)) return res.status(400).json({ message: 'Invalid Email Address' });
    if (mobileNo && !isValidMobileNo(mobileNo)) return res.status(400).json({ message: 'Invalid Mobile Number' });

    // Check for duplicates
    const [emailExists, mobileNoExists] = await Promise.all([
      email ? doesEmailExist(email, userId) : false,
      mobileNo ? doesContactNoExist(mobileNo, userId) : false,
    ]);

    if (email && emailExists) return res.status(400).json({ message: 'Email is already registered' });
    if (mobileNo && mobileNoExists) return res.status(400).json({ message: 'Mobile Number is already registered' });

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, isActive: true },
      { $set: req.body },
      { new: true }
    );

    console.log("User updated successfully:", updatedUser); // Log updated user
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // More specific error logging
    return res.status(500).json({ message: 'An error occurred while updating the user' });
  }
};



// const updateUser = async (req, res) => {
//   const userId = req.params.id;
//   const cnic = req.body.cnic;
//   const email = req.body.email;
//   const mobileNo = req.body.mobileNo;

//   try {
//     const user = User.findById(userId);

//     if (!user) return res.status(404).json({ message: 'User not found' });
//     if (!user.isActive) return res.status(400).json({ message: 'Bad Request' });

//     const validateCnic = isValidCnic(cnic);
//     const validateEmail = isValidEmail(email);
//     const validateMobileNo = isValidMobileNo(mobileNo);

//     if (cnic && !validateCnic) return res.status(400).json({ message: 'Invalid CNIC' });
//     if (email && !validateEmail) return res.status(400).json({ message: 'Invalid Email Address' });
//     if (mobileNo && !validateMobileNo) return res.status(400).json({ message: 'Invalid Mobile Number' });

//     const cnicRegistered = cnic && await doesCnicExist(cnic);
//     const emailExists = email && await doesEmailExist(email);
//     const mobileNoExists = mobileNo && await doesContactNoExist(mobileNo);

//     if (cnic && cnicRegistered) return res.status(400).json({ message: 'CNIC is already Registered'});
//     if (email && emailExists) return res.status(400).json({ message: 'Email is already Registered'});
//     if (mobileNo && mobileNoExists) return res.status(400).json({ message: 'Mobile Number is already Registered'});
  
//     const user = await User.findOneAndUpdate(
//       { _id: userId, isActive: true },
//       { $set: { ...req.body } },
//       { new: true }
//     );
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// Delete (Deactivate) User
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOneAndUpdate(
      { _id: userId, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




const uploadCV = async (req, res) => {
  console.log("Received upload request with params:", req.params);

  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
  }

  const { userTypeId } = req.params;
  let originalFileName = req.file.filename;

  try {
    // Find the user based on userTypeId only
    const user = await User.findOneAndUpdate(
      { userTypeId: userTypeId, isActive: true },
      { $set: { 'professionalDetails.cv': originalFileName } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const userId = user._id; // Get userId from the found user
    const newFileName = `${userId}-${Date.now()}.pdf`; // Generate a unique filename using userId
    const uploadPath = path.join(__dirname, '..', 'uploads', newFileName);

    // Rename the file to include userId
    fs.rename(req.file.path, uploadPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ status: 'error', message: 'File rename error.' });
      }

      // Update the file reference in user’s record
      user.professionalDetails.cv = newFileName;
      user.save();

      res.status(200).json({ status: 'success', message: 'File uploaded successfully', fileName: newFileName });
    });
  } catch (error) {
    console.error("Error in uploadCV:", error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
};



const downloadCV = async (req, res) => {
  try {
    const { userId, adminId } = req.body;

    if (adminId) {
      const admin = await User.findById({ _id: adminId, userTypeId: 1, isActive: true });
      if (!admin) return res.status(404).json({ message: 'Admin User not found' });
    }

    const user = await User.findById({ _id: userId, isActive: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const filePath = path.resolve(__dirname, '../uploads', user.professionalDetails.cv);
    console.log('File Path:', filePath);

    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

    res.download(filePath, (err) => {
      if (err) return res.status(500).send('Error downloading file.');
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadOtherDocs = async (req, res) => {
  console.log("Received other docs upload request with params:", req.params);

  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
  }

  const { userId, userTypeId } = req.params;
  let originalFileName = req.file.filename;

  try {
    // Find the user based on userId and userTypeId for authentication
    const user = await User.findOneAndUpdate(
      { _id: userId, userTypeId: userTypeId, isActive: true },
      { $set: { 'professionalDetails.otherDocs': originalFileName } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found or unauthorized' });
    }

    const newFileName = `${userId}-${Date.now()}.pdf`;
    const uploadPath = path.join(__dirname, '..', 'uploads', newFileName);

    // Rename the file to include userId
    fs.rename(req.file.path, uploadPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ status: 'error', message: 'File rename error.' });
      }

      // Update the file reference in user’s record
      user.professionalDetails.otherDocs = newFileName;
      user.save();

      res.status(200).json({ status: 'success', message: 'File uploaded successfully', fileName: newFileName });
    });
  } catch (error) {
    console.error("Error in uploadOtherDocs:", error);
    res.status(500).json({ status: 'error', message: 'Server error. Please try again later.' });
  }
};

const downloadOtherDocs = async (req, res) => {
  try {
    const { userId, adminId } = req.body;

    if (adminId) {
      const admin = await User.findById({ _id: adminId, userTypeId: 1, isActive: true });
      if (!admin) return res.status(404).json({ message: 'Admin User not found' });
    }

    const user = await User.findById({ _id: userId, isActive: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const filePath = path.resolve(__dirname, '../uploads', user.professionalDetails.otherDocs);
    console.log('File Path:', filePath);

    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');

    res.download(filePath, (err) => {
      if (err) return res.status(500).send('Error downloading file.');
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadCV,
  downloadCV,
  uploadOtherDocs,
  downloadOtherDocs
};