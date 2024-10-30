const express = require('express');
const { verifyToken, authenticate } = require('../config/jwt');
const { login, logout, setUpdatePassword } = require('../repositories/authRepo');

const router = express.Router();

router.post('/login', login);
router.get('/logout', verifyToken, logout);
router.post('/api/:userTypeId/setPassword',setUpdatePassword);

module.exports = router;