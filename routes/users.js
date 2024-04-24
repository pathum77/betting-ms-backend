const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userControlller = require('../controllers/userController');

router.post('/login', userControlller.login);
router.post('/add-manager', auth.verifyJWT, auth.checkRole(['admin']), userControlller.addManager);
router.post('/add-agent', auth.verifyJWT, auth.checkRole(['admin', 'manager']), userControlller.addAgent);
router.get('/get-user-data', auth.verifyJWT, userControlller.getUserData)
router.get('/get-users', auth.verifyJWT, auth.checkRole(['admin', 'manager']), userControlller.getUsers);
router.get('/get-user-role', auth.verifyJWT, userControlller.getUserRole);

module.exports = router;