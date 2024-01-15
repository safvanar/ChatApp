const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

function generateAccessToken(id){
    return jwt.sign({userId: id}, 'secret-key')
}

exports.postSignUp = async (req, res, next) => {
    try{
        let {name, email, phone, password} = req.body
        let userExist = await User.findOne({where: {[Op.or]: [ {email: email}, {phone: phone} ]}})
        if(!userExist){
            password = bcrypt.hashSync(password, 10)
            await User.create({name, email, phone, password})
            return res.status(200).json({message: 'user registered succesfully!', success: true})
        }else{
            return res.status(409).json({message: 'user already exist!', success: false})
        }
    }catch(err){
        return res.status(400).json({message: 'user signup failed!', success: false})
    }
}

exports.postSignin = async (req, res, next) => {
    try{
        let {username, password} = req.body
        const user = await User.findOne({where: {email: username}})
        if(user){
            if(bcrypt.compareSync(password, user.password)){
                const token = generateAccessToken(user.id) //jwt.sign({userId: user.id, isPremiumUser: user.isPremiumUser}, 'secret-key')
                res.status(200).json({login: 'success', token: token})
            }else{
                throw new Error('Authentication failure')
            }  
        }
        else{
            return res.status(404).json({message: "user doesn't exist"})
        }
    }catch(err){
        return res.status(401).json({message: 'user signin failed!', success: false})
    }
}