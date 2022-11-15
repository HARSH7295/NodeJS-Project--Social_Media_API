// importing Packages

// 1> express
const express = require('express')
//2> connectDB from ../Db/DBConnect
const connectDB = require('../Db/DBConnect')
// routes 
const userRouter = require('../Routes/userRoutes')
const adminRouter = require('../Routes/adminRoutes')
const postRouter = require('../Routes/postRoutes')
// creating app
const app = express()

// NOTE -->  IMP -->  to work with json must add 
app.use(express.json())

// seperating routes according to url and their work
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/post',postRouter)

// port for server
const port = 8000

// defining start function to connect to dbs and start server
const start = async()=>{
    try{
        await connectDB("mongodb://127.0.0.1/SocialMediaAPIDB")
        app.listen(port,()=>{
            console.log("Server is running on port : "+port)
        })
    }
    catch(error){
        console.log(error)
    }
}

// calling start function
start()

// port running check
app.get('/isServerOn',(req,res)=>{
    res.json({
        "messgae":"server is running"
    })
})