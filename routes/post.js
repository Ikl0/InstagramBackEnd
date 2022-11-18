const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requirelogin')
const Post = mongoose.model("Post")

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

module.exports = router