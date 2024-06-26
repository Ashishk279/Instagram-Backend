import express from 'express';
import { Signup, Verify, editProfile, getUser, login, logout, resend, changeProfilePicture, changePassword, createPosts, deletePosts, getAllPosts, postStatus, findUser, followUser, unFollowUser, getFollowersOfUser, getUserFollowing, viewContentOfFollowing, commentOnPost, likeOnPost, dislikePost, editCommentOnPost, removeCommentOnPost} from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

userRouter.post("/signup", Signup)
userRouter.post("/verify", Verify)
userRouter.post("/resend", resend)
userRouter.post("/login", login)
userRouter.post("/logout", verifyJWT, logout)
userRouter.post("/details", verifyJWT, upload.single("profilePicture"), editProfile)
userRouter.get("/getuser", verifyJWT, getUser)
userRouter.post("/changephoto", verifyJWT, upload.single("profilePicture"), changeProfilePicture)
userRouter.post("/changepassword", verifyJWT, changePassword)
userRouter.post("/post", verifyJWT, upload.single("post"), createPosts)
userRouter.patch("/posts/:id", verifyJWT, deletePosts)
userRouter.get("/post", verifyJWT, getAllPosts)
userRouter.get("/status", verifyJWT, postStatus)
userRouter.get("/search", verifyJWT, findUser)
userRouter.post("/follow", verifyJWT, followUser)
userRouter.delete("/unfollow", verifyJWT, unFollowUser)
userRouter.get("/followers", verifyJWT, getFollowersOfUser)
userRouter.get("/following", verifyJWT, getUserFollowing)
userRouter.get("/following-content", verifyJWT, viewContentOfFollowing)
userRouter.post("/p/:postid/comment", verifyJWT, commentOnPost)
userRouter.patch("/p/:postid/edit", verifyJWT, editCommentOnPost)
userRouter.patch("/p/:postid/remove", verifyJWT, removeCommentOnPost)
userRouter.post("/p/:postid/like", verifyJWT, likeOnPost)
userRouter.delete("/p/:postid/dislike", verifyJWT, dislikePost)

export { userRouter }