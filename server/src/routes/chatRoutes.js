const express = require('express');
const router = express.Router();
const { sendMessage, getEventMessages, getClubMessages } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');


router.post('/', protect, sendMessage);


router.get('/event/:eventId', protect, getEventMessages);
router.get('/club/:clubId', protect, getClubMessages);

module.exports = router;