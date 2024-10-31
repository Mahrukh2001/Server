const express = require('express');
const { verifyToken, authenticate } = require('../config/jwt');
const { upload } = require('../config/multer');
const { createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadCV,
  downloadCV
} = require('../repositories/userRepo');

const router = express.Router();

router.post('/user/:userTypeId', authenticate, createUser);
router.get('/users/:userTypeId', verifyToken, getAllUsers);
router.get('/user/:id', verifyToken, getUserById);
router.put('/user/:id', verifyToken, updateUser);
router.delete('/user/:id', verifyToken, deleteUser);

//  CV
router.post('/user/cv/upload/:userTypeId', upload.single('pdf'), uploadCV);
router.post('/user/cv/download', verifyToken, downloadCV);

module.exports = router;