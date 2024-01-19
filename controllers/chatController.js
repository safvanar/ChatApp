const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Chat = require('../models/chat-history')

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

exports.getMessages = async (req, res, next) => {
    try{
        const chats = await Chat.findAll()
        return res.status(200).json({status: 'success', chats: chats})
    }catch(err){
        return res.status(400).json({status: 'failed'})
    }
}