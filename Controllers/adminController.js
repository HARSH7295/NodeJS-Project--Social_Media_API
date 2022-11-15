
// defining controllers

const { StatusCodes } = require("http-status-codes")
const User = require("../Models/User")
const Post = require("../Models/Post")

// getAllUsers
const getAllUsers = async(req,res)=>{
    try{
        const users = await User.find({})
        
        res.status(StatusCodes.OK).json({
            users : users
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error in getting users data."
        })
    }
}

//getUser
const getUser = async(req,res)=>{
    const {id} = req.params
    try{
        const user = await User.findOne({
            _id : id
        })        
        res.status(StatusCodes.OK).json({
            users : user
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"No user with id : "+id
        })
    }
}

//deleteUser
const deleteUser = async(req,res)=>{
    const {id} = req.params
    try{
        const currUser = await User.find({
            _id : id
        })
        
        // when deleting user, then 
            // need to delete posts posted by him,
            // need to remove it's id from followers of all users, that he was following before 
            // need to remove like from all posts in which he liked before


        // deleting posts made by currUser
        const posts = await Post.deleteMany({
            postedBy : currUser
        })

        // removing id from followers list for all users that he was following before
        const followingsList = currUser.followings

        followingsList.map(async(item)=>{
            var followersList = []
            const user = await User.findOne({
                _id : item
            })
            followersList = user.followers.filter((ide)=>{
                if(ide !== currUser._id){
                    return ide
                }
            })
            const updatedUser = await User.findByIdAndUpdate(user.id,{
                followers : followersList
            })
        })
        
        // removing like from posts that currUser has liked before
        const myLikesList = currUser.myLikes
        myLikesList.map(async(item)=>{
            var likedByList = []
            const post = await Post.findOne({
                _id : id
            })
            likedByList = post.likedBy.filter((item)=>{
                if(item !== currUser._id){
                    return item
                }
            })
            const updatedPost = await Post.findByIdAndUpdate(post._id,{
                likedBy : likedByList
            })
        })

        // all related stuff removed so finally deleting user
        const deletedUSer = await User.findByIdAndDelete(currUser._id)
        res.status(StatusCodes.OK).json({
            "message":"User Deleted.!!"
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"No account with id : : "+id
        })
    }
}

module.exports = {
    getAllUsers,
    getUser,
    deleteUser
}