const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/signup', userController.postSignUp)
router.post('/signin', userController.postSignin)
router.get('/:userId', userController.getUser)

module.exports = router