import { User } from "../models/user.model.js"
import { OTP } from "../models/otp.model.js";
import { Post } from "../models/post.model.js"
import { ApiError } from "../utils/apiErrors.js"
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../utils/responseCode.js"
import { generateOtpEmail, verifyEmailCode } from "./otp.js"
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js"
import { i18n } from "../utils/i18n.js";
import { uploadOnClodinary } from "../utils/cloudinary.js"
import { hashPasswordUsingBcrypt, comparePasswordUsingBcrypt } from "../utils/utility.js"
import { Follow } from "../models/follow.model..js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js"
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

const changePicture = async (inputs, avatarInLocal) => {
    let existedUser;
    if (avatarInLocal) {
        console.log(avatarInLocal)
        let profilePicture = await uploadOnClodinary(avatarInLocal)
        if (!profilePicture) throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("upload_file"))
        existedUser = await User.findByIdAndUpdate(inputs, { profilePicture: profilePicture.url })
        let updatedUser = await User.findById(existedUser._id).lean().select({ password: 0, refreshToken: 0, isEmailVerified: 0 })
        return updatedUser
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("not_found"))
    }
}

const updatePassword = async (user, inputs) => {
    let existedUser
    let hashPassword = await hashPasswordUsingBcrypt(inputs.password)
    existedUser = await User.findByIdAndUpdate(user, { password: hashPassword })
}
const createPost = async (user, inputs, file) => {
    let newPost;
    let id;
    const lastPost = await Post.findOne({ user_id: user._id }).sort({ postNo: -1 });
    console.log(lastPost)
    id = lastPost ? lastPost.postNo : 0;
    if (file) {
        let uploadPost = await uploadOnClodinary(file);
        if (!uploadPost) throw new ApiError(INTERNAL_SERVER_ERROR, i18n.__("upload_file"))
        newPost = await Post.create({ postNo: id + 1, title: inputs.title, body: inputs.body, post: uploadPost.url, user_id: user._id, status: inputs.status });
        return newPost;
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("not_found"))
    }
}

const deletePost = async (user, id) => {
    let data = await Post.findOneAndUpdate({ user_id: user, postNo: id }, { isDeleted: true });
    if (!data) throw new ApiError(BAD_REQUEST, i18n.__("unknown_data"))
}

const getPosts = async (user) => {
    return await Post.find({ user_id: user, isDeleted: false });
}

const getPostsStatus = async (user) => {
    let groupedPosts = await Post.aggregate([
        {
            $match: { user_id: user._id, isDeleted: false }
        },
        {
            // Separate posts by their status using $facet
            $facet: {
                draft: [{ $match: { status: 'draft' } }],
                published: [{ $match: { status: 'published' } }],
                archived: [{ $match: { status: 'archived' } }]
            }
        },
    ])
    return groupedPosts;
}

const userData = async (inputs) => {
    let user;
    if (!(inputs.username || inputs.fullName)) throw new ApiError(BAD_REQUEST, i18n.__("search"))
    user = await User.aggregate([
        {
            $match: {
                $or: [
                    { username: inputs.username },
                    { fullName: inputs.fullName }
                ]
            }
        },
        {
            $project: {
                password: 0, // Exclude password from the results
                refreshToken: 0,
                isEmailVerified: 0
            }
        }
    ]);
    return user
}

const createFollow = async (inputs, user) => {
    let existingFollow;
    let newFollow;
    if (!inputs.following_user_id) throw new ApiError(BAD_REQUEST, i18n.__("error_userId"))
    existingFollow = await Follow.findOne({ following_user_id: inputs.following_user_id, followed_user_id: user._id });
    if (!existingFollow) {
        newFollow = await Follow.create({ following_user_id: inputs.following_user_id, followed_user_id: user })
        return newFollow
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("already_follow"))
    }

}
const deleteFollow = async (inputs, user) => {
    let existingFollow;
    if (!inputs.following_user_id) throw new ApiError(BAD_REQUEST, i18n.__("error_userId"))

    existingFollow = await Follow.findOneAndDelete({ following_user_id: inputs.following_user_id, followed_user_id: user._id });
    if (!existingFollow) throw new ApiError(BAD_REQUEST, i18n.__("not_exists"))

}

const getFollower = async (user) => {
    return await Follow.aggregate([
        {
            $match: {
                following_user_id: user._id
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'following_user_id',
                foreignField: "_id",
                as: "noOfFollowers"
            }
        },
        // {
        //     $unwind: '$followerDetails'
        // },
        {
            $project: {
                _id: 0,
                follower: '$followed_user_id',
            }
        }

    ])
}

const getFollowing = async (user) => {
    return Follow.aggregate([
        {
            $match: {
                followed_user_id: user._id
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followed_user_id',
                foreignField: "_id",
                as: "noOfFollowers"
            }
        },
        // {
        //     $unwind: '$followerDetails'
        // },
        {
            $project: {
                _id: 0,
                following: '$following_user_id',
            }
        }
    ])
}

const getContent = async (user) => {
    let content = await Follow.aggregate([
        {
            $match: { followed_user_id: user._id }
        },
        {
            $lookup: {
                from: 'posts',
                localField: 'following_user_id',
                foreignField: 'user_id',
                as: 'Posts'
            }
        },
        {
            $unwind: '$Posts'
        },
        {
            $replaceRoot: {
                newRoot: '$Posts'
            }
        },
        {
            $match: {
                status: 'published',
                isDeleted: false
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: "user"
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                body: 1,
                post: 1,
                user_id: 1,
                status: 1,
                'user.fullName': 1
            }
        }
    ])
    return content
}

const comment = async (user, inputs, postId) => {
    let post;
    let newComment;
    post = await Post.findById({ _id: postId.postid });
    if (!post) throw new ApiError(BAD_REQUEST, i18n.__("post_not_exists"))
    if(!post.isCommentsEnabled) throw new ApiError(BAD_REQUEST, i18n.__("disable_comment"))    
    newComment = await Comment.create({ postId: postId.postid, userId: user._id, comment: inputs.comment })
    post = await Post.findByIdAndUpdate({ _id: postId.postid }, {$inc: {commentsCount: 1}})
    return newComment
}

const editComment = async (user, inputs, postId) => {
    let comment;
    comment = await Comment.findOneAndUpdate({ postId: postId.postid, userId: user._id, isDeleted: false }, { comment: inputs.comment })
    if (!comment) throw new ApiError(BAD_REQUEST, i18n.__("invalid_comment"))
    comment = await Comment.findById(comment._id).lean().select({isDeleted: 0})
    return comment
}

const removeComment = async (user, postId) => {
    let comment;
    comment = await Comment.findOneAndUpdate({ postId: postId.postid, userId: user._id, isDeleted: false }, { isDeleted: true })
    if (!comment) throw new ApiError(BAD_REQUEST, i18n.__("invalid_comment"))
    comment = await Comment.findById(comment._id)
    post = await Post.findByIdAndUpdate({ _id: postId.postid }, {$inc: {commentsCount: -1}})
}

const like = async (user, postId) => {
    let post;
    let newLike;
    post = await Post.findById({ _id: postId.postid });
    if (!post) throw new ApiError(BAD_REQUEST, i18n.__("post_not_exists"))
    newLike = await Like.findOne({
        postId: postId.postid,
        userId: user._id,
        like: true
    })
    if (newLike) {
        throw new ApiError(BAD_REQUEST, i18n.__("alreadyLike"))
    }
    else {
        newLike = await Like.create({ postId: postId.postid, userId: user._id, like: true })
        post = await Post.findByIdAndUpdate({ _id: postId.postid }, {$inc: {likesCount: 1}})
        return newLike
    }
}

const dislike = async (user, postId) => {
    let post;
    let newLike;
    post = await Post.findById({ _id: postId.postid });
    if (!post) throw new ApiError(BAD_REQUEST, i18n.__("post_not_exists"))
    newLike = await Like.findOne({
        postId: postId.postid,
        userId: user._id,
        like: true
    })
    if (newLike) {
        newLike = await Like.findOneAndDelete({ postId: postId.postid, userId: user._id, like: true })
        post = await Post.findByIdAndUpdate({ _id: postId.postid }, {$inc: {likesCount: -1}})
    } else {
        throw new ApiError(BAD_REQUEST, i18n.__("invalid_like"))
    }
}


export {
    createUser,
    verifyOTP,
    resendOtp,
    updateDetails,
    loginUser,
    logoutUser,
    getUserDetails,
    changePicture,
    updatePassword,
    createPost,
    deletePost,
    getPosts,
    getPostsStatus,
    userData,
    createFollow,
    deleteFollow,
    getFollower,
    getFollowing,
    getContent,
    comment,
    editComment,
    removeComment,
    like,
    dislike,
}