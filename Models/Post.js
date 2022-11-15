// imports

//1> mongoose
const mongoose = require("mongoose")

// defining post schema
const postSchema = mongoose.Schema(
    {
        postedBy : {
            type : mongoose.Types.ObjectId,
            ref:'User',
            required : true,
        },
        description : {
            type : String,
            max : [200, "Please provide description of length less than 200"],
            required : [true,"please provide description"]
        },
        img : {
            type : String,
        },
        likedBy:{
            type : Array,
            default : [],
        },
    },{
        timestamps : true
    }
)


// creating post model
const Post = mongoose.model('Post',postSchema)

// exporting
module.exports = Post