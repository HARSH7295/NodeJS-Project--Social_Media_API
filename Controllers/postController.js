const { StatusCodes } = require("http-status-codes")
const Post = require("../Models/Post")
const User = require("../Models/User")

const createPost = async(req,res)=>{
    const {description,img} = req.body
    if(!description){
        res.status(StatusCodes.FORBIDDEN).json({
            "errorMessage":"Please provide description.!!"
        })
    }
    else{
        try{
            const user = await User.findOne({
                _id : req.user.id,
                email : req.user.email
            })
            const post = await Post.create({
                postedBy : user,
                description : description,
                img : img
            })
            res.status(StatusCodes.CREATED).json({
                "message":"Post created.!!!",
                "post":post
            })
        }
        catch(error){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "errorMessage":"Error in creating post",
                "error":error
            })
        }
    }
}

const getPost = async(req,res)=>{
    const {id} = req.params
    try{
        const post = await Post.findOne({
            _id : id
        })
        res.status(StatusCodes.OK).json({
            "post":post
        })
    }
    catch(error){
        res.status(StatusCodes.CREATED).json({
            "errorMessage":"No post by id : "+id
        })
    }
}


const getAllPosts = async(req,res)=>{
    try{
        const user = await User.findOne({
            _id : req.user.id,
            email : req.user.email
        })
        const posts = await Post.find({
            postedBy : user
        })
        res.status(StatusCodes.OK).json({
            "posts":posts
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in fetching Posts."
        })
    }
}

const updatePost = async(req,res)=>{
    const {id} = req.params
    try{
        const post = await Post.findOne({
            _id : id,
        })
        if(post.postedBy == req.user.id){
            const updatedPost = await Post.findByIdAndUpdate(id,req.body)
            res.status(StatusCodes.OK).json({
                "message":"Post Updated.!!"
            })
        }
        else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "errorMessage":"You are not authorized to Update this post"
            })
        } 
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in updating.!!",
            "error":error
        })
    }
}

const deletePost = async(req,res)=>{
    const {id} = req.params
    try{
        const post = await Post.findOne({
            _id : id,
        })
        if(post.postedBy == req.user.id){
            const post = await Post.findByIdAndDelete(id)
            res.status(StatusCodes.OK).json({
                "message":"Post Deleted.!!"
            })
        }
        else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                "errorMessage":"You are not authorized to Delete this post"
            })
        } 
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in Deleting.!!",
            "error":error
        })
    }
}

// likePost
const likeUnlikePost = async(req,res)=>{
    const {id} = req.params
    try{
        const post = await Post.findOne({
            _id : id
        })
        const currUser = await User.findOne({
            _id : req.user.id
        })
        var likedByList = post.likedBy
        var myLikesList = currUser.myLikes
        var opr = ""
        if((likedByList.includes(req.user.email)) && (myLikesList.includes(post._id))){
            likedByList = likedByList.filter((item)=>{
                if(item !== currUser._id){
                    return item
                }
            })
            myLikesList = myLikesList.filter((item)=>{
                if(item !== post._id){
                    return item
                }
            })
            
            opr = "unliked"
        }
        else{
            likedByList.push(currUser._id)
            myLikesList.push(post._id)
            opr = "liked"
        }
        const updatedPost = await Post.findByIdAndUpdate(id,{
            likedBy : likedByList
        })
        const updatedUser = await User.findByIdAndUpdate(currUser._id,{
            myLikes : myLikesList
        }) 
        res.status(StatusCodes.OK).json({
            "message": "operation : "+opr
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":error
        })
    }
}

module.exports = {
    createPost,
    getPost,
    getAllPosts,
    updatePost,
    deletePost,
    likeUnlikePost
}

