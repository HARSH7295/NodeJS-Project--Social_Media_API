 
// imports

//1> user model
const User = require("../Models/User")
//2>statuscodes from http-status-codes
const {StatusCodes} = require("http-status-codes")
const Post = require("../Models/Post")

// defining controllers 

//getMyProfile
const getMyProfile = async(req,res)=>{
    try{
        const user = await User.findOne({
            _id : req.user.id
        })        
        res.status(StatusCodes.OK).json({
            "MyProfile":{
                "name" : user.name,
                "email" : user.email,
                "role": user.role,
                "profilePicture":user.profilePicture,
                "coverPicture":user.coverPicture,
                "followers":user.followers,
                "followings":user.followings
            }
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"No user with id : "+id
        })
    }
}

//get user's profile
const getProfile = async(req,res)=>{
    const {id} = req.params
    try{
        const user = await User.findOne({
            _id : id
        })        
        res.status(StatusCodes.OK).json({
            "MyProfile":{
                "name" : user.name,
                "email" : user.email,
                "role": user.role,
                "profilePicture":user.profilePicture,
                "coverPicture":user.coverPicture,
                "followers":user.followers,
                "followings":user.followings
            }
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"No user with id : "+id
        })
    }
}


//delete my self
const deleteMyAcc = async(req,res)=>{
    try{
        const currUser = await User.findOne({
            _id : req.user.id
        })
        
        // when deleting user, then 
            // need to delete posts posted by him,
            // need to remove it's id from followers of all users, that he was following before
            // need to remove its'id from followings of all users, that he was following before 
            // need to remove like from all posts in which he liked before


        // deleting posts made by currUser
        /*const posts = await Post.deleteMany({
            postedBy : currUser
        })*/

        // removing id from followers list for all users that he was following before
        const currUsersfollowingsList = currUser.followings
        currUsersfollowingsList.map(async(item)=>{
            var followersList = []
            const user = await User.findOne({
                _id : item
            })
            
            followersList = user.followers.filter((ide)=>{
                if(ide != currUser._id+""){
                    return ide
                }
            })
            
            const updatedUser = await User.findByIdAndUpdate(user._id,{
                followers : followersList
            })
        })

        // removing id from following list of all users that he was following before
        const currUsersfollowersList = currUser.followers
        currUsersfollowersList.map(async(item)=>{
            var followingsList = []
            const user = await User.findOne({
                _id : item
            })

            followingsList = user.followings.filter((ide)=>{
                if(ide != currUser._id+""){
                    return ide
                }
            })

            const updatedUser = await User.findByIdAndUpdate(user._id,{
                followings : followingsList
            })
        })

        
        // removing like from posts that currUser has liked before
        const myLikesList = currUser.myLikes
        myLikesList.map(async(item)=>{
            var likedByList = []
            const post = await Post.findOne({
                _id : item+""
            })
            likedByList = post.likedBy.filter((item)=>{
                if(item != currUser._id+""){
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
            "errorMessage":"Error while deleting account "
        })
    }
}

// update user
const updateUser = async(req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.user.id,req.body)
        res.status(StatusCodes.OK).json({
            "message":"Updating done.!!"
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured during updating...!"
        })
    }
}

// follow user -- MUST SEE

const follow = async(req,res)=>{
    
    // user to be unfollowed's id
    const {id} = req.params
    try{
        const userToBeFollowed = await User.findOne({
            _id : id
        })
        const currUser = await User.findOne({
            _id : req.user.id
        })
        if(id === req.user.id){
            // checking if pointing to himself or not
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"You can not follow/unfollow yourself"
            })
        }
        else{
            var followersList = userToBeFollowed.followers
            var followingsList = currUser.followings

            // if userToBeFollowed 's followers list already contain currUser 's id 
            // or
            // currUser's following list already contain userToBeUnFollowed's id
            // then can't do operation

            if(((followersList.includes(req.user.id)) || (followingsList.includes(id)))){
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"You already follow this user."
                })
            }
            else{
                // updating userToBeFollowed's followers list
                followersList.push(currUser._id)
                const updatedFollwedUser = await User.findByIdAndUpdate(id,{
                    followers : followersList
                })
                
                // updating currUser's following list
                
                followingsList.push(userToBeFollowed._id)
                const updatedFollowingUser = await User.findByIdAndUpdate(currUser._id,{
                    followings : followingsList
                })

                res.status(StatusCodes.OK).json({
                    "message" : "Follow operation successful.!!"
                })
            }
        }
    }
    catch(error){
        res.status(StatusCodes.NOT_FOUND).json({
            "errorMessage":"No user with id : "+id
        })
    }
}

// unfollow user
const unFollow = async(req,res)=>{
    // user to be unfollowed's id
    const {id} = req.params
    try{
        const userToBeUnFollowed = await User.findOne({
            _id : id
        })
        const currUser = await User.findOne({
            _id : req.user.id
        })
        if(id === req.user.id){
            // checking if pointing to himself or not
            res.status(StatusCodes.BAD_REQUEST).json({
                "errorMessage":"You can not follow/unfollow yourself"
            })
        }
        else{
            var followersList = userToBeUnFollowed.followers
            var followingsList = currUser.followings

            // if userToBeUnFollowed 's followers list doesn't contain currUser 's id 
            // or
            // currUser's following list doesn't contain userToBeUnFollowed's id
            // then can't do operation

            if(!((followersList.includes(req.user.id)) || (followingsList.includes(id)))){
                res.status(StatusCodes.BAD_REQUEST).json({
                    "errorMessage":"You can not unfollow this user, because you are not following it."
                })
            }
            else{
                try{
                    // updating userToBeUnFollowed's followers list
                    followersList = followersList.filter(item => item != currUser._id+"")
                    const updatedUnFollwedUser = await User.findByIdAndUpdate(userToBeUnFollowed._id,{
                        followers : followersList
                    })
                    
                    // updating currUser's following list
                    followingsList = followingsList.filter(item => item != userToBeUnFollowed._id+"")
                    const updatedUnFollowingUser = await User.findByIdAndUpdate(currUser._id,{
                        followings : followingsList
                    })
                    res.status(StatusCodes.OK).json({
                        "message" : "Unfollow operation successful.!!"
                    })
                }
                catch(error){
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        "errorMessage" : "Error occured during un following process"
                    })
                }
            }
        }
    }
    catch(error){
        res.status(StatusCodes.NOT_FOUND).json({
            "errorMessage":"No user with id : "+id
        })
    }
}

// get followers list
const getFollowers = async(req,res)=>{
    const {id} = req.params
    try{
        var followersList = []
        const currUser = await User.findOne({
            _id : id
        })
        const followersIdList = currUser.followers
        
        for(let item in followersIdList){
            const user = await User.findOne({
                _id : followersIdList[item]
            })
            followersList.push({
                "id":user._id,
                "name":user.name,
                "email":user.email,
                "profilePicture":user.profilePicture               
            })
        }
        res.status(StatusCodes.OK).json({
            "followers" : followersList
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in fetching followers data"
        })
    }
}


// get followings list
const getFollowings = async(req,res)=>{
    const {id} = req.params
    try{
        var followingsList = []
        const currUser = await User.findOne({
            _id : id
        })
        const followingsIdList = currUser.followings
        
        for(let item in followingsIdList){
            const user = await User.findOne({
                _id : followingsIdList[item]
            })
            followingsList.push({
                "id":user._id,
                "name":user.name,
                "email":user.email,
                "profilePicture":user.profilePicture               
            })
        }
        res.status(StatusCodes.OK).json({
            "followings" : followingsList
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in fetching followings data"
        })
    }
}

// get my liked posts
const getMyLikedPost = async(req,res)=>{
    try{
        const currUser = await User.findOne({
            _id : req.user.id
        })
        var myLikedPosts = []
        const myLikes = currUser.myLikes
        for(let i in myLikes){
            const post = await Post.findOne({
                _id : myLikes[i]
            })
            myLikedPosts.push(post)            
        }
        console.log(myLikedPosts)
        res.status(StatusCodes.OK).json({
            "myLikedPosts":myLikedPosts
        })
    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in fetching mylikes data"
        })
    }

}

// get friends list -- users that follows us - considered as friends here
const getFriends = async(req,res)=>{

}

// get feed posts
const getFeed = async(req,res)=>{
    try{
        const user = await User.findOne({
            _id : req.user.id
        })
        var myPosts = await Post.find({
            postedBy : user
        })
        var postsByFollowings = []
        user.followings.map(async(item)=>{
            var temp = await Post.find({
                postedBy : item
            })
            postsByFollowings = postsByFollowings.concat(temp)
        })
        var feed = myPosts.concat(postsByFollowings)
        res.status(StatusCodes.OK).json({
            "feed": feed
        })
    }
    catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            "errorMessage":"Error occured in getting feed.!!",
            "error":e
        })
    }
}

// exports
module.exports = {
    getMyProfile,
    getProfile,
    updateUser,
    deleteMyAcc,
    follow,
    unFollow,
    getFriends,
    getFollowers,
    getFollowings,
    getMyLikedPost,
    getFeed
}