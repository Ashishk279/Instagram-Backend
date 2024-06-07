import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        default: "",
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        trim: true,
        default: "",
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        default: "",
    },
    fullName: {
        type: String,
        trim: true,
        default: "",
    },
    bio: {
        type: String,
        trim: true,
        default: "",
    },
    profilePicture: {
        type: String,
        trim: true,
        default: "",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    }
}, {timestamp: true});

const User = mongoose.model("User", userSchema);

export { User }