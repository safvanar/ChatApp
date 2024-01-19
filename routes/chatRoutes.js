const express = require('express')
const chatController = require('../controllers/chatController')

const router = express.Router()

router.get('/getMessages', chatController.getMessages)
router.get('/', chatController.getChatHome)
router.post('/', chatController.postChat)

module.exports = router