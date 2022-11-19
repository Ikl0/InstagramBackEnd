const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postShcema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        requred: true
    },
    photo: {
        type: String,
        default: "No photo"
    },
    postedBy:{
        type: ObjectId,
        ref:"User"
    }
})

mongoose.model("Post", postShcema)