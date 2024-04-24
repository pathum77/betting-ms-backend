const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const betController = require('../controllers/betsController');

router.post('/add-bet', auth.verifyJWT, auth.checkRole(['manager', 'agent']), betController.addBet);
router.get('/get-bets/:byDate', auth.verifyJWT, auth.checkRole(['admin', 'manager']), betController.getBets);

module.exports = router;