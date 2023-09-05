const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users_controller');
const authMiddleware = require('../config/authMiddleware');

router.post('/create-session', authMiddleware.authenticateUser, users_controller.createSession);
router.post('/delete/:id', authMiddleware.authenticateUser, users_controller.delete);
router.post('/addCustomer', authMiddleware.authenticateUser, users_controller.addCustomer);

router.get('/addPage', users_controller.addPage);

module.exports = router;