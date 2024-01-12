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


// const sequelize = require('./utils/database')

const app = express();

//Routes
const userRoutes = require('./routes/userRoutes')

//Models
const User = require('./models/user')

app.use(express.static('public'))

app.use(compression())

app.use(bodyParser.json({ extended: false }));

app.use(express.urlencoded({ extended: false }))

app.use(cors());

app.use('/user', userRoutes)



app.use((req, res, next) => {
    res.sendFile('home.html', {root:'views'})
})

//Associations

const PORT = process.env.PORT

async function initiate(){
    try {
        await sequelize.sync()
            app.listen(PORT || 3000, () => {
            console.log(`Server running on port ${PORT}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

initiate()
