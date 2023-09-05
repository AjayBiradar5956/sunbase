const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users_controller');
const authMiddleware = require('../config/authMiddleware');

router.post('/create-session', authMiddleware.authenticateUser, users_controller.createSession);

module.exports = router;