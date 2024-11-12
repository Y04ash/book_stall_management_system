// this file is use for building connection with mongo db

const mongoose = require('mongoose')
require('dotenv').config();
const connectDB=  ()=>{
    try{
        const conn=  mongoose.connect(process.env.DataBaseUrl)
        console.log("database connected")
    }catch (error){
        console.log("error occured ", error)
        process.exit(1)
    }
};

module.exports =  connectDB