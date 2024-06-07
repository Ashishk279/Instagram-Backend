import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefershToken } from "./utility.js";
import { INTERNAL_SERVER_ERROR } from "./responseCode.js";
import { ApiError } from "./apiErrors.js";
import { i18n } from "./i18n.js";
const generateAccessAndRefreshToken = async (user) => {
    try {
        const existeduser = await User.findById(user._id)
        const accessToken = await generateAccessToken(user)
        const refreshToken = await generateRefershToken(user)
    
        existeduser.refreshToken = refreshToken;
        await existeduser.save({ validateBeforeSave: false })
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("error"))
    }
}

export { generateAccessAndRefreshToken }