import { validateSignup, validateVerify, validateResend, validateDetails, validateLogin, validatePassword, validatePost, validateUser } from "../validations/user.js";
import { hashPasswordUsingBcrypt } from "../utils/utility.js";
import { createUser, verifyOTP, resendOtp, updateDetails, loginUser, logoutUser, getUserDetails, changePicture, updatePassword, createPost,deletePost, getPosts, getPostsStatus, userData } from "../services/user.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { OK } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";

const Signup = async (req, res, next) => {
    try {
        const { username, email, name, password } = req.body;
        await validateSignup(req.body);
        const hashPassword = await hashPasswordUsingBcrypt(req.body.password);
        const newUser = await createUser(req.body, hashPassword);
        return res.status(OK).json(new ApiResponse(OK, newUser, i18n.__("send_otp")))
    } catch (err) {
        next(err)

    }
}

const Verify = async ( req, res, next) => {
    try {
        const { email, otp } = req.body;
        await validateVerify(req.body);
        const user = await verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("otp_verified")))
    } catch (error) {
        next(error)
    }
}

const resend = async ( req, res, next ) => {
    try {
        const { email } = req.body;
        await validateResend(req.body);
        const user = await resendOtp(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("otp_resend")))
    } catch (error) {
        next(error)
    }
}

const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        await validateLogin(req.body);
        const {accessToken, refreshToken, loggedInUser} = await loginUser(req.body);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(OK).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, i18n.__("loggedIn")))
    } catch (error) {
        next(error)
    }
}

const logout = async(req, res, next) => {
    try{
       const options = await logoutUser(req.user);
       return res.status(OK).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(OK, {}, i18n.__("logout")))
    }catch (error) {
        next(error)
    }
}

const editProfile = async ( req, res, next ) => {
    try{
        const {profilePicture, bio} = req.body
        let avatarInLocal = req.file
        await validateDetails(req.body, avatarInLocal);
        const user = await updateDetails(req.body, req.user , avatarInLocal.path)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("detail_updated")))
    }catch (error) {
        next(error)
    }
}
const getUser = async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("user_detail")))
    } catch (error) {
        next(error)
    }
}

const changeProfilePicture = async (req, res, next) => {
    try {
        let avatarInLocal = req.file
        const user = await changePicture(req.user, avatarInLocal.path);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("change_avatar")))
    } catch (error) {
        next(error)
    }
}

const changePassword = async (req, res, next) => {
    try {
        const { newPassword }  = req.body
        await validatePassword(req.body);
        await updatePassword(req.user, req.body);
        return res.status(OK).json(new ApiResponse(OK, {}, i18n.__("change_Password")))
    } catch (error) {
        next(error)
    }
}
const createPosts = async (req, res, next) => {
    try {
        const { title, body, status }  = req.body
        let post = req.file
        await validatePost(req.body);
        const newPost = await createPost(req.user, req.body, post.path);
        return res.status(OK).json(new ApiResponse(OK, newPost , i18n.__("post_created")))
    } catch (error) {
        next(error)
    }
}

const deletePosts = async( req, res, next ) => {
    try {
        let id = req.params.id
        const post = await deletePost(req.user, req.params);
        return res.status(OK).json(new ApiResponse(OK, {} , i18n.__("post_deleted")))
    } catch (error) {
        next(error)
    }
}

const getAllPosts = async(req, res, next) => {
    try {
        const post = await getPosts(req.user);
        return res.status(OK).json(new ApiResponse(OK, post , i18n.__("get_posts")))
    } catch (error) {
        next(error)
    }
}

const postStatus = async(req, res, next) => {
    try {
        const post = await getPostsStatus(req.user);
        return res.status(OK).json(new ApiResponse(OK, post , i18n.__("get_posts")))
    } catch (error) {
        next(error)
    }
}

const findUser = async(req, res, next) => {
    try {
        const {username, fullName} = req.query;
        await validateUser(req.query);
        const user = await userData(req.query);
        return res.status(OK).json(new ApiResponse(OK, user , i18n.__("user_detail")))

    } catch (error) {
        next(error)
    }
}


export {
    Signup,
    Verify,
    resend,
    editProfile,
    login,
    logout,
    getUser,
    changeProfilePicture,
    changePassword,
    createPosts,
    deletePosts,
    getAllPosts,
    postStatus,
    findUser
}