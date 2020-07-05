const express = require('express')
require("dotenv").config
const mongoose = require("mongoose")
const app = express();

// IMPORT THE FILES
const postrouter = require("./routes/posts.js")

// USING THE MIDDLEWARE

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/post" , postrouter)

// HOME PAGE
app.get('/',(req,res)=>{
    res.send("this is the home page...!")
})

// CONNECT TO THE DATABASE
mongoose.connect("process.env.DATABASE_URL",{ useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("Connected to db...")
})


// SERVER LISTENING
app.listen(3000,()=>{
    console.log("The server is listening....")
})


