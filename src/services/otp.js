import { sendOtp } from "./sendOtpEmail.js"
import { expiredAt, generateOTP } from "../utils/utility.js";
import { OTP } from "../models/otp.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { BAD_REQUEST } from "../utils/responseCode.js";
const generateOtpEmail = async (inputs) => {
    try {
        const otp = generateOTP()
        await sendOtp(inputs.email, otp)
        await OTP.create({ email: inputs.email, otp: otp,  expiredAt: expiredAt() })
    } catch (err) {
        throw  new ApiError(BAD_REQUEST, err);
    }
}

export { generateOtpEmail }