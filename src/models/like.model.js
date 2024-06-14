import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    like: {
        type: Boolean,
        default: false,
        required: true
    }
},{timestamps: true})

const Like = mongoose.model('Like', likeSchema)

export { Like }