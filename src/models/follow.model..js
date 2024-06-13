import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followed_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Follow = mongoose.model("Follow", followSchema)

export { Follow }