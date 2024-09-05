const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const router = express.Router();

router.get('/:roomId', getMessages);  // Fetch messages by room ID
router.post('/', sendMessage);  // Send a new message

module.exports = router;
