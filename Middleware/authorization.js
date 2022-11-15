const {StatusCodes} = require('http-status-codes')

const authorization = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(StatusCodes.UNAUTHORIZED).json({
                errorMsg : "You are not Authorized to access this route."
            })
        }
        next()
    }
}

module.exports = authorization