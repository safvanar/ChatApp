const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.getChatHome = (req, res, next) => {
    res.sendFile('chat.html', {root: 'views'})
}

exports.postChat = async (req, res, next) => {
    const message = req.body.message
    const date = req.body.dateTime
    const userObj = jwt.verify(req.body.token, 'secret-key')
    console.log(`TOKEN:::::::::::${userObj.userId}`)
    const user = await User.findByPk(userObj.userId)
    await user.createChat({message: message, date: date})
    res.status(200).json({status: 'success', message: message})
}