
//imports
//1> jwt
const jwt = require('jsonwebtoken')

// jwtsecretkey
const JWT_SECRET_KEY = "harsh@6519@Key"

// defining getUserToken func.
const getUserToken = async(user)=>{
    const token = await jwt.sign({data:user},JWT_SECRET_KEY,{expiresIn:"1h"})
    return token
}

module.exports = getUserToken