const express = require('express');
const router = express.Router();
const users_controller = require('../controllers/users_controller');
const authMiddleware = require('../config/authMiddleware');

router.post('/create-session', authMiddleware.authenticateUser, users_controller.createSession);
router.post('/delete/:id', authMiddleware.authenticateUser, users_controller.delete);
router.post('/addCustomer', authMiddleware.authenticateUser, users_controller.addCustomer);
router.post('/modifyCustomer/:id', authMiddleware.authenticateUser, users_controller.modifyCustomer);

router.get('/addPage', users_controller.addPage);
router.get('/updatePage/:id', users_controller.updatePage);

module.exports = router;