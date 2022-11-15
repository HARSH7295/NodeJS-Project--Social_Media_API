
// imports
//1> express
const express = require("express")

//2> controllers
const {getAllUsers,getUser,deleteUser} = require("../Controllers/adminController")
const authentication = require('../Middleware/authentication')
const authorization = require('../Middleware/authorization')
// defining router
const router = express.Router()

// defining routes

// get all users
router.route('/getAllUsers').get(authentication,authorization("Admin"),getAllUsers)
// get particular user
router.route('/getUser/:id').get(authentication,authorization("Admin"),getUser)
//// delete user
router.route('/deleteUser/:id').delete(authentication,authorization("Admin"),deleteUser)

// exports
module.exports = router