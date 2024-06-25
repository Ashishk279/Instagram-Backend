import { validateSignup, validateVerify, validateResend, validateDetails, validateLogin, validatePassword, validatePost, validateUser, validateFollow, validateComment } from "../validations/user.js";
import { hashPasswordUsingBcrypt } from "../utils/utility.js";
import { createUser, verifyOTP, resendOtp, updateDetails, loginUser, logoutUser, getUserDetails, changePicture, updatePassword, createPost, deletePost, getPosts, getPostsStatus, userData, createFollow, deleteFollow, getFollower, getFollowing, getContent, comment, editComment, removeComment, like, dislike } from "../services/user.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { OK } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";

// Api for Signup user
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

// Api for otp verify
const Verify = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        await validateVerify(req.body);
        const user = await verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("otp_verified")))
    } catch (error) {
        next(error)
    }
}

// Api for resent Otp
const resend = async (req, res, next) => {
    try {
        const { email } = req.body;
        await validateResend(req.body);
        const user = await resendOtp(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("otp_resend")))
    } catch (error) {
        next(error)
    }
}

// Api for login 
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await validateLogin(req.body);
        const { accessToken, refreshToken, loggedInUser } = await loginUser(req.body);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(OK).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, i18n.__("loggedIn")))
    } catch (error) {
        next(error)
    }
}

// Api for logout
const logout = async (req, res, next) => {
    try {
        const options = await logoutUser(req.user);
        return res.status(OK).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(OK, {}, i18n.__("logout")))
    } catch (error) {
        next(error)
    }
}

// Api for edit Profile
const editProfile = async (req, res, next) => {
    try {
        const { profilePicture, bio } = req.body
        let avatarInLocal = req.file
        await validateDetails(req.body, avatarInLocal);
        const user = await updateDetails(req.body, req.user, avatarInLocal.path)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("detail_updated")))
    } catch (error) {
        next(error)
    }
}

// Api for getting user details
const getUser = async (req, res, next) => {
    try {
        const user = await getUserDetails(req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("user_detail")))
    } catch (error) {
        next(error)
    }
}

// Api for changing profile picture
const changeProfilePicture = async (req, res, next) => {
    try {
        let avatarInLocal = req.file
        const user = await changePicture(req.user, avatarInLocal.path);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("change_avatar")))
    } catch (error) {
        next(error)
    }
}

// Api for change password
const changePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body
        await validatePassword(req.body);
        await updatePassword(req.user, req.body);
        return res.status(OK).json(new ApiResponse(OK, {}, i18n.__("change_Password")))
    } catch (error) {
        next(error)
    }
}

// Api for create Post
const createPosts = async (req, res, next) => {
    try {
        const { title, body, status } = req.body
        let post = req.file
        await validatePost(req.body);
        const newPost = await createPost(req.user, req.body, post.path);
        return res.status(OK).json(new ApiResponse(OK, newPost, i18n.__("post_created")))
    } catch (error) {
        next(error)
    }
}

// Api for delete post
const deletePosts = async (req, res, next) => {
    try {
        let id = req.params.id
        const post = await deletePost(req.user, req.params.id);
        return res.status(OK).json(new ApiResponse(OK, {}, i18n.__("post_deleted")))
    } catch (error) {
        next(error)
    }
}

// Api for get all post 
const getAllPosts = async (req, res, next) => {
    try {
        const post = await getPosts(req.user);
        return res.status(OK).json(new ApiResponse(OK, post, i18n.__("get_posts")))
    } catch (error) {
        next(error)
    }
}

// Api for getting post according to their status
const postStatus = async (req, res, next) => {
    try {
        const post = await getPostsStatus(req.user);
        return res.status(OK).json(new ApiResponse(OK, post, i18n.__("get_posts")))
    } catch (error) {
        next(error)
    }
}

// Api for find user
const findUser = async (req, res, next) => {
    try {
        const { username, fullName } = req.query;
        await validateUser(req.query);
        const user = await userData(req.query);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("user_detail")))

    } catch (error) {
        next(error)
    }
}

// Api for follow user
const followUser = async (req, res, next) => {
    try {
        const { following_user_id } = req.body
        await validateFollow(req.body);
        const user = await createFollow(req.body, req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("user_follow")))
    } catch (error) {
        next(error)
    }
}

// Api for unfollow user
const unFollowUser = async (req, res, next) => {
    try {
        const { following_user_id } = req.body
        await validateFollow(req.body);
        const user = await deleteFollow(req.body, req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("unfollow")))
    } catch (error) {
        next(error)
    }
}

// Api for getting no of followers of user
const getFollowersOfUser = async (req, res, next) => {
    try {
        const user = await getFollower(req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("follower")))
    } catch (error) {
        next(error)
    }
}

// Api for getting following of user 
const getUserFollowing = async (req, res, next) => {
    try {

        const user = await getFollowing(req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("following")))
    } catch (error) {
        next(error)
    }
}

// Api for view content posted by people that user follow
const viewContentOfFollowing = async (req, res, next) => {
    try {
        const user = await getContent(req.user);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("view_content")))
    } catch (error) {
        next(error)
    }
}

// Api for add comment on the post 
const commentOnPost = async (req, res, next) => {
    try {
        const postId = req.params;
        const userId = req.user;
        const message = req.body
        await validateComment(req.body);
        const user = await comment(req.user, req.body, req.params);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("comment")))
    } catch (error) {
        next(error)
    }
}

// Api for edit comment 
const editCommentOnPost = async (req, res, next) => {
    try {
        const postId = req.params;
        const userId = req.user;
        const message = req.body
        await validateComment(req.body);
        const user = await editComment(req.user, req.body, req.params);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("comment")))
    } catch (error) {
        next(error)
    }
}

// Api for remove comment 
const removeCommentOnPost = async (req, res, next) => {
    try {
        const postId = req.params;
        const userId = req.user;
        const user = await removeComment(req.user, req.params);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("comment")))
    } catch (error) {
        next(error)
    }
}

// Api for like on the post 
const likeOnPost = async (req, res, next) => {
    try {
        const postId = req.params;
        const userId = req.user;
        const user = await like(req.user, req.params);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("like")))
    } catch (error) {
        next(error)
    }
}

// Api for dislike on the post 
const dislikePost = async (req, res, next) => {
    try {
        const postId = req.params;
        const userId = req.user;
        const user = await dislike(req.user, req.params);
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("dislike")))
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
    findUser,
    followUser,
    unFollowUser,
    getFollowersOfUser,
    getUserFollowing,
    viewContentOfFollowing,
    commentOnPost,
    editCommentOnPost,
    removeCommentOnPost,
    likeOnPost,
    dislikePost,
}