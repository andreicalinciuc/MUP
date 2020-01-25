const jwt = require('jsonwebtoken')

function verified(req,res,next) {
    const token = req.header('auth-token')
    if(!token) return res.status(401).send('Access denied')
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch(err) {
        res.status(401).send({
            error: {
                message:'Invalid token'
            }
        }
        )
    }
}
module.exports = verified