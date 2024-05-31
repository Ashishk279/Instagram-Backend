import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        default: "",
        unique: true,
        lowercase: true
    },
    otp: {
        type: String,
        trim: true,
        default: ""
    },
    expiredAt: {
        type: Date, 

    },
}, {timestamp: true})

const OTP = mongoose.model("OTP", otpSchema);

export { OTP }