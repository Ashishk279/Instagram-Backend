import { sendOtp } from "./sendOtpEmail.js"
import { expiredAt, generateOTP } from "../utils/utility.js";
import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { BAD_REQUEST } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";

const generateOtpEmail = async (inputs) => {
    try {
        let user;
        const otp = generateOTP()
        await sendOtp(inputs.email, otp)
        user = await OTP.findOne({ email: inputs.email })
        if (!user) {
            await OTP.create({ email: inputs.email, otp: otp, expiredAt: expiredAt() })
        } else {
            await OTP.findOneAndUpdate({ email: inputs.email }, { otp: otp, expiredAt: expiredAt() })
        }
    } catch (err) {
        throw new ApiError(BAD_REQUEST, err);
    }
}

const verifyEmailCode = async (otp, user) => {
    try {
        if (user.expiredAt >= new Date()) {
            return user.otp == otp ? true : false;
        } else {
            throw new ApiError(BAD_REQUEST, i18n.__("otp_expired"));
        }
    } catch (error) {
        throw new ApiError(BAD_REQUEST, error);
    }
}

export {
    generateOtpEmail,
    verifyEmailCode
}