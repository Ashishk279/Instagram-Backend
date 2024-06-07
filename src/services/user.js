import { User } from "../models/user.model.js"
import { OTP } from "../models/otp.model.js"
import { ApiError } from "../utils/apiErrors.js"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from "../utils/responseCode.js"
import { generateOtpEmail, verifyEmailCode } from "./otp.js"
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js"
import { i18n } from "../utils/i18n.js";
import { uploadOnClodinary } from "../utils/cloudinary.js"
import { comparePasswordUsingBcrypt } from "../utils/utility.js"
const createUser = async (inputs, hashPassword) => {
    let user;
    user = await User.findOne({ email: inputs.email, isEmailVerified: true });
    if (!user) {
        let otpuser
        otpuser = await OTP.findOne({ email: inputs.email });
        if (!otpuser) {
            await generateOtpEmail(inputs)
            user = await User.create({ username: inputs.username, email: inputs.email, fullName: inputs.fullName, password: hashPassword })
        } else {
            const value = i18n.__("already_exists")
            throw new ApiError(BAD_REQUEST, value)
        }
    } else {
        const value = i18n.__("already_exists")
        throw new ApiError(BAD_REQUEST, value)
    }
}

const verifyOTP = async (inputs) => {
    let user;
    user = await OTP.findOne({ email: inputs.email });
    const verifyCode = await verifyEmailCode(inputs.otp, user)

    if (verifyCode == false) {
        throw new ApiError(BAD_REQUEST.i18n.__("invalid_otp"))
    }
    user = await User.findOneAndUpdate({ email: inputs.email }, { isEmailVerified: true })
    let updatedUser = await User.findById(user._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 })
    return updatedUser;
}

const resendOtp = async (inputs) => {
    let user;
    user = await OTP.findOne({ email: inputs.email });
    await generateOtpEmail(inputs);
}

const loginUser = async (inputs) => {
    let user;
    user = await User.findOne({ email: inputs.email });
    if (user) {
        let compare = await comparePasswordUsingBcrypt(inputs.password, user.password);
        if (!compare) {
            throw new ApiError(BAD_REQUEST, i18n.__("invalid_Password"))
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);
        let loggedInUser = await User.findById(user._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 });
        return { accessToken, refreshToken, loggedInUser };
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("invalid_user"))
    }
}

const logoutUser = async (inputs) => {
    await User.findByIdAndUpdate(inputs._id, { $set: { refreshToken: undefined } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    }
    return options;

}

const updateDetails = async (inputs, user, avatarInLocal) => {
    let existedUser;
    if (avatarInLocal) {
        console.log(avatarInLocal)
        let profilePicture = await uploadOnClodinary(avatarInLocal)
        if (!profilePicture) throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("upload_file"))
        existedUser = await User.findByIdAndUpdate(user?._id, { profilePicture: profilePicture.url, bio: inputs.bio })
        let updatedUser = await User.findById(existedUser._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 })
        return updatedUser
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("edit_profile"))
    }
}

const getUserDetails = async (user) => {
    return await User.findById(user._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 })
}

export {
    createUser,
    verifyOTP,
    resendOtp,
    updateDetails,
    loginUser,
    logoutUser,
    getUserDetails
}