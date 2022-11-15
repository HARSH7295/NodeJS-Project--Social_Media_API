// imports

//1> mongoose
const mongoose = require("mongoose")
//2> validator
const validator = require("validator")
//3> bcryptjs
const bcrypt = require("bcryptjs")


// defining user schema
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        require : [true,"Please provide Name."],
        min : [3,"Please provide name of valid length >= 3"],
        max : [20,"Please provide name of valid length <= 20"],
    },
    email : {
        type : String,
        require : [true,"Please provide Email."],
        unique : [true,"Please provide another email, this one is used.!!"],
        // validate : allow only if valid email
        validate : {
            validator : validator.isEmail,
            message : "Please provide valid email."
        }
    },
    password : {
        type : String,
        require : [true,"Please provide Password."],
    },
    role : {
        type : String,
        enum : ["Admin","Normal"],
        default : "Normal"
    },
    profilePicture : {
        type : String,
        default : "",
    },
    coverPicture : {
        type : String,
        default : "",
    },
    followers : {
        type : Array,
        default : [],
    },
    followings : {
        type : Array,
        default : [],
    },
    myLikes : {
        type : Array,
        default : []
    },
    aboutSelf : {
        type : String,
        max : [200, "Please provide about self of length less than 200"]
    },
},{
    timestamps : true
})

// defining pre : save functionality to save password as encrypted

/* imp notes for this functionality:
    
    1> must use async function(next){} --> bcz to use own functionality,
        binding is needed and that is provided by function , but "not provided" by "arrow func.()=>"
        
    2> save password in hashed format using hash() -> provide salt, and original password
    
    3> must use next() when operations done, if not used then process will no go further then save
    
    */
userSchema.pre("save",async function(next){
    // checking if password is changed then, save it as ecnrypted
    if(this.isModified("password")){
        // salt
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    }
    next()
})

// defining method for user "instance" : comparePassword
// again note : using function() instead of arrow()=>, bcz of binding

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatched = await bcrypt.compare(candidatePassword, this.password)
    return isMatched
    // if matched then return true else return false
}

// creating model of user
const User = mongoose.model('User',userSchema)

//exporting
module.exports = User