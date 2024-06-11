import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followed_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const follow = mongoose.model("follow", followSchema)

export { follow }