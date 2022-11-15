
// imports
//1> express
const express = require("express")
const { getMyProfile,getProfile,deleteMyAcc,updateUser,follow,unFollow,getFriends, getFollowers, getFollowings, getMyLikedPost, getFeed } = require("../Controllers/userController")
//2> controllers
const {RegisterUser,LoginUser} = require("../Controllers/authController")
const authentication = require("../Middleware/authentication")

// defining route
const router = express.Router()

// defining routes
// 1> register user
router.route('/register').post(RegisterUser)

// 2> login user
router.route('/login').post(LoginUser)
//get my profile
router.route('/getMyProfile').get(authentication,getMyProfile)
// get profile
router.route('/getProfile/:id').get(authentication,getProfile)
// delete my account
router.route('/deleteMyAcc').delete(authentication,deleteMyAcc)
// update my info
router.route('/update/:id').patch(authentication,updateUser)
// follow user
router.route('/follow/:id').patch(authentication,follow)
// unfollow user
router.route('/unfollow/:id').patch(authentication,unFollow)

router.route('/getFriends').get(authentication,getFriends)
// get followers
router.route("/:id/followers").get(authentication,getFollowers)
// get followings
router.route("/:id/followings").get(authentication,getFollowings)
// get myliked posts
router.route("/myLikedPosts").get(authentication,getMyLikedPost)

// get feed posts
router.route("/getFeed").get(authentication,getFeed)

// exporting route that has paths defined above
module.exports = router