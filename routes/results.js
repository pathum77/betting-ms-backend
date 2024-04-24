const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resultController = require('../controllers/resultController');

router.get('/get-result/:byDate', auth.verifyJWT, auth.checkRole(['admin']), resultController.getResults);

module.exports = router;