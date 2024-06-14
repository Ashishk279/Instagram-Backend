import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
    comment: {
        type: String,
        trim: true,
        default: "",
        required: true
    },
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false,
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

export { Comment }