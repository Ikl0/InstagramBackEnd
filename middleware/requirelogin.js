const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //auth == Bearer
    if(!authorization){
       return res.status(401).json({error:"You have to Sign In"})
    }
    const token = authorization.replace("Bearer ","")

    jwt.verify(token, JWT_SECRET, (error,payload)=>{
        if(error){
            return res.status(401).json({error:"You have to Sign In"})
        }
        
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
        })
        next()
    })
}