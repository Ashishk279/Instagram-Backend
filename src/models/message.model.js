import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const messageSchema = new mongoose.Schema({
    messageId: {
        type: String,
        default: uuidv4(), // Automatically generate a UUID for each message
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true,
        default: ""
    },
    isReaded: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const Message = mongoose.model("Message", messageSchema);

export {
    Message
}