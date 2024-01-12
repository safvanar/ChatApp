const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

router.post('/signup', userController.postSignUp)

module.exports = router