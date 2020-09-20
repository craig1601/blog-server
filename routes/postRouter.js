const postRouter = require('express').Router();
const Post = require('../models/postModel');




postRouter.get("/posts", async (req, res) => {
    const posts = await Post.find({});
    res.json({
        posts
    });
})

postRouter.post("/posts", async (req, res) => {
   try
    {const {title, content, author} = req.body;

    const newPost = new Post({
        title,
        content,
        author
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
    }
    catch(err){
        res.status(500).json({msg: err.message});
    }
})

postRouter.get("/posts/:postID", async (req, res) =>{
    const findPost = await Post.findById({_id:req.params.postID});
    res.json({
        post:findPost
    });
})

postRouter.get("/posts/user/:userName", async (req, res) =>{
    const findPosts = await Post.find({author:req.params.userName});
    res.json({
        posts:findPosts
    });
})

postRouter.delete("/posts/:postID", async(req, res) => {
    const deletedPost = await Post.deleteOne({_id:req.params.postID});
    res.json({
        post:deletedPost
    });
})

module.exports = postRouter;  