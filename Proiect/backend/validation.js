const Joi = require('joi')
const registerValidation = (data) => {
    const schema = {
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        confirm_password:Joi.string().min(6).required(),
        role: Joi.string().required()
    }
    return Joi.validate(data,schema)
}
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    }
    return Joi.validate(data,schema)
}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation