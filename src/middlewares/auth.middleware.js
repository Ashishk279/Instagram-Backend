import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js"
import { BAD_REQUEST, UN_AUTHORIZED } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";
import jwt from "jsonwebtoken"

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(UN_AUTHORIZED, i18n.__("invalid_Request"))
        }

        const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user = await User.findById(decordedToken?._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 })
        if (!user) {
            throw new ApiError(BAD_REQUEST, i18n.__("invalid_token"))
        }

        req.user = user;
        next()
    } catch (error) {
        next(error)
    }
}

export { verifyJWT }