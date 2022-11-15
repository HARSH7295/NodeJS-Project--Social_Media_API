
const express = require("express")
const authentication = require("../Middleware/authentication")
const {createPost,getPost,getAllPosts,updatePost,deletePost,likeUnlikePost} = require('../Controllers/postController')

const router = express.Router()

router.route('/create').post(authentication,createPost)
router.route('/all').get(authentication,getAllPosts)
router.route('/:id').get(authentication,getPost)
router.route('/update/:id').patch(authentication,updatePost)
router.route('/delete/:id').delete(authentication,deletePost)

// like post
router.route('/like/:id').patch(authentication,likeUnlikePost)


module.exports = router