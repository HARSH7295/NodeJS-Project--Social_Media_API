 
// imports

//1> user model
const User = require("../Models/User")
//2>statuscodes from http-status-codes
const {StatusCodes} = require("http-status-codes")
//3> getUserToken from utils/tokenGeneration
const getUserToken = require("../Utils/tokenGeneration")

// SPECIAL PERMISION FOR CREATING ADMIN USER
const SPECIAL_PERMISSION_KEY_FOR_ADMIN = "admin@6519@7295@5282@KEY"

// defining controllers 

// REGISTER-USER
const RegisterUser = async(req,res)=>{
    const {name,email,password} = req.body

    // if anything is not provided then
    if(!email || !name || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            "errorMessage":"Please provide name, email and password."
        })
    }
    else{
        // checking is email is already registered
        const emailIsAlreadyRegistred = await User.findOne({
            email : email
        })
        if(emailIsAlreadyRegistred){
            res.status(StatusCodes.NOT_ACCEPTABLE).json({
                "errorMessage":"Email is already registered..Try different email.!!"
            })
        }
        else{
            if(req.query.specialPermision){
                if(req.query.specialPermision === SPECIAL_PERMISSION_KEY_FOR_ADMIN){
                    // admin creation
                    try{
                        const user = await User.create({
                            name : name,
                            email : email,
                            password : password,
                            role : "Admin"
                        })
                        const userToken = await getUserToken(user)
                        res.status(StatusCodes.CREATED).json({
                            "user":{
                                "id":user._id,
                                "name":user.name,
                                "email":user.email,
                                "role":user.role,
                                "token":userToken,
                            }
                        })
                    }
                    catch(error){
                        res.status(StatusCodes.BAD_REQUEST).json({
                            "errorMessage":"Some error occured during creation of user..",
                        })
                    }
                }
                else{
                    res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json({
                        "errorMessage":"Invalid special key.!!!"
                    })
                }
            }
            else{
                //normal user creation
                try{
                    const user = await User.create({
                        name : name,
                        email : email,
                        password : password
                        // as normal is provided as default so no need to explicitly tell here,
                    })
                    const userToken = await getUserToken(user)
                    res.status(StatusCodes.CREATED).json({
                        "user":{
                            "id":user._id,
                            "name":user.name,
                            "email":user.email,
                            "role":user.role,
                            "token":userToken,
                        }
                    })
                }
                catch(error){
                    res.status(StatusCodes.BAD_REQUEST).json({
                        "errorMessage":"Some error occured during creation of user..",
                    })
                }
            }
        }
    }
}

const LoginUser = async(req,res)=>{
    const { email, password } = req.body
    if(!email || !password){
        res.status(StatusCodes.BAD_REQUEST).json({
            "errorMessage":"Please provide email and password."
        })
    }
    else{
        try{    
            const user = await User.findOne({
                email : email
            })
            const isMatched = await user.comparePassword(password)
            if(isMatched){
                const userToken = await getUserToken(user)
                res.status(StatusCodes.OK).json({
                    "user":{
                        "id":user._id,
                        "name":user.name,
                        "email":user.email,
                        "role":user.role,
                        "token":userToken,
                    }
                })
            }
            else{
                res.status(StatusCodes.UNAUTHORIZED).json({
                    "errorMessage":"Invalid Credentials"
                })
            }
        }
        catch(error){
            res.status(StatusCodes.NOT_FOUND).json({
                "errorMessage":"No user with email : "+email
            })
        }
    }
}

module.exports = {
    RegisterUser,
    LoginUser
}