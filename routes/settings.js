const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const drawTypeCOntroller = require('../controllers/settingsController');

router.post('/add-draw-type', auth.verifyJWT, auth.checkRole(['admin']), drawTypeCOntroller.addDrawType);
router.get('/get-draw-types', drawTypeCOntroller.getDrawTypes);
router.post('/add-place', auth.verifyJWT, auth.checkRole(['admin']), drawTypeCOntroller.addPlace);
router.get('/get-places', drawTypeCOntroller.getPlaces);
router.post('/change-password',auth.verifyJWT, drawTypeCOntroller.changePassword);

module.exports = router;