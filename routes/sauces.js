const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');



router.get('/' + '', auth, saucesCtrl.getAllsauces);
router.post('/', auth, multer,  saucesCtrl.createSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, multer, saucesCtrl.deleteOneSauce);
router.post('/:id/like', auth, multer, saucesCtrl.likeSauce);

module.exports = router;
