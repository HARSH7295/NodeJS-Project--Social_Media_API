// imports
const { StatusCodes } = require("http-status-codes")
const jwt = require("jsonwebtoken")
const User = require("../Models/User")


// jwtsecretkey
const JWT_SECRET_KEY = "harsh@6519@Key"

// defining authentication
const authentication = async(req,res,next) =>{
    if(!(req.headers.authorization)){
        res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({
            "errorMessage":"Authorization header missing"
        })
    }
    else{
        const authHeader = req.headers.authorization
        if(!(authHeader.startsWith('Bearer'))){
            res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({
                "errorMessage":"Invalid authorization header type."
            })
        }
        else{
            try{
                const authHeader = req.headers.authorization
                const token = authHeader.split(' ')[1]
                const {data : { _id : id,email:email, name: name, role : role}}  = await jwt.verify(token,JWT_SECRET_KEY)
                const user = await User.findOne({
                    _id : id
                })
                if(!user){
                    res.status(StatusCodes.NOT_ACCEPTABLE).json({
                        "errorMessage":"Authentication Invalid "
                    })
                }
                else{
                    req.user = { 
                        name : name,
                        email : email,
                        role: role,
                        id: id
                    }
                    next()
                }
            }
            catch(error){
                res.status(StatusCodes.REQUEST_TIMEOUT).json({
                    errorMsg : error
                })
            }
        }
    }
}

module.exports = authentication