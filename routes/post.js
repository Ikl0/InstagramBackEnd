const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requirelogin')
const Post = mongoose.model("Post")

router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(error=>{
        console.log(error)
    })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { title, body } = req.body
    if (!title || !body) {
        return res.status(422).json({ error: "Please fill all fields" })
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(error => {
            console.log(error)
        })
})

router.get('/mypost', requireLogin, (req, res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(error=>{
        console.log(error)
    })
})

router.put('/like', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((error,result)=>{
        if(error){
            return res.status(422).json({error:error})
        }else{
            res.json(result)
        }
    })
})

router.put('/dislike', requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((error,result)=>{
        if(error){
            return res.status(422).json({error:error})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likcommentses:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .exec((error,result)=>{
        if(error){
            return res.status(422).json({error:error})
        }else{
            res.json(result)
        }
    })
})

module.exports = router