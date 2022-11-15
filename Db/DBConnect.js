
// imports

//1> mongoose
const mongoose = require("mongoose")

// defining connectdb function
const connectDB = async(url)=>{
    // takes url of dbs loc.
    return mongoose.connect(url,{
        useNewUrlParser : true,
    })
}

// exporting
module.exports = connectDB