const router = require('express').Router()
const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res) => {
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send({
        error: {
            message:error.details[0].message,
            status:400
        }
    })
    if(req.body.password !== req.body.confirm_password) return res.status(400).send(
        {
            error: {
                message:'Parolele nu coincid',
                status: 400
            }
        })
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        role: req.body.role
    })

    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) return res.status(400).send({
        error: {
            message:'Emailul exista',
            status:400
        }})

    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).send({
            error: {
                message:err,
                status:400
            }
            })
    }
})

router.post('/login', async (req,res) => {
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send(
        {
            error: {
                message: `Email nu exista`,
                status:400
            }
        }
        )

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send({
        error: {
            message:'Parola gresita!',
            status:400
        }})

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token',token)
    res.send({
        id:user._id, 
        token:token, 
        name:`${user.firstName} ${user.lastName}`,
        role:user.role
    })
})


module.exports = router
