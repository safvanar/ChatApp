//starting of app.js
require('dotenv').config();

const fs = require('fs');
const path = require('path')

const bodyParser = require('body-parser')
const sequelize = require('./utils/database')
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// const sequelize = require('./utils/database')

const app = express();

//Routes
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')

//Models
const User = require('./models/user')
const Chat = require('./models/chat-history')

User.hasMany(Chat)
Chat.belongsTo(User)

app.use(express.static('public'))

app.use(compression())

app.use(bodyParser.json({ extended: false }));

app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: '*',
    methods:['GET','POST'],
  }));

app.use('/user', userRoutes)

app.use('/chat', chatRoutes)

app.use((req, res, next) => {
    res.sendFile('home.html', {root:'views'})
})

//Associations

const PORT = process.env.PORT

let socketsConnected = new Set()

async function initiate(){
    await sequelize.sync()
    const server = app.listen(PORT || 3000, () => {
        console.log(`Server running on port ${PORT}...`)
    })

    const io = require('socket.io')(server)
    io.on('connection', onConnected)

    function onConnected(socket){
        console.log(socket.id)
        socketsConnected.add(socket.id)
        io.emit('clients-total', socketsConnected.size)

        socket.on('disconnect', () => {
            console.log('socket disconnected: ', socket.id)
            socketsConnected.delete(socket.id)
            io.emit('clients-total', socketsConnected.size)
        })

        socket.on('message', async (data) => {
            const uid = jwt.verify(data.token, 'secret-key' )
            const user = await User.findByPk(uid.userId)
            data.name = user.name
            socket.broadcast.emit('chat-message', data)
        })
    }
}

initiate()