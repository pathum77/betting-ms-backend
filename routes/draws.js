const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const drawController = require('../controllers/drawController');

router.post('/add-draw', auth.verifyJWT, auth.checkRole(['admin']), drawController.addDraw);
router.get('/get-draws/:byDate', drawController.getDraws);

module.exports = router;