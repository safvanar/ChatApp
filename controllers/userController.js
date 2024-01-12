const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

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