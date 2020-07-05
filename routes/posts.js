const express = require('express');
const router = express.Router();
const Post = require("../models/Post.js")
const redis = require("redis")
const util = require("util")

// CONNECT TO THE REDIS DATABASE
const redisUrl = "redis://127.0.0.1:6379"
const client = redis.createClient(redisUrl)
client.on('connect' , ()=>{
    console.log('connected to the redis database...')
}) 
client.get = util.promisify(client.get)

// GET ALL THE POSTS
router.get('/' , async (req,res)=>{
    try{
        const posts = await Post.find()
        res.json(posts)
    }
    catch(err){
        res.json(err)
    }
})

// SUBMIT THE POST
router.post("/",(req,res)=>{
    const post = new Post({
        title : req.body.title,
        description : req.body.description
    })

    post.save()
        .then(data => {
            res.json(data)
            //res.redirect("/")
        })
        .catch(err => {
            res.json({message : err})
        })
})

// GET A SPECIFIC POST
router.get('/:postId' , async (req,res)=>{

        // FIRST TRY TO FETCH FROM THE REDIS
        const cachedBlogs = await client.get(req.params.postId) 
        console.log(cachedBlogs) 
        if(cachedBlogs){
            console.log("fetched from the redis server")
            return res.send(JSON.parse(cachedBlogs))
        }
        
        // THEN FETCH FROM MONGODB
        const post = await Post.findById(req.params.postId)
        console.log("fetched from mongodb")
        console.log(req.params.postId)
        console.log(post)

        // AND STORE IN THE REDIS
        client.set(req.params.postId , JSON.stringify(post)) 
    
    /*catch(err){
        res.json({message:"cannot fetch due to some error.."});
    }*/
})

module.exports = router;