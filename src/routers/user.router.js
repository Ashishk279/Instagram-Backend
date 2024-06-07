import express from 'express';
import { Signup, Verify, editProfile, getUser, login, logout, resend } from "../controllers/user.controller.js"
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const userRouter = express.Router();

userRouter.post("/signup", Signup)
userRouter.post("/verify", Verify)
userRouter.post("/resend", resend)
userRouter.post("/login", login)
userRouter.post("/logout", verifyJWT, logout)
userRouter.post("/details", upload.single("profilePicture"), verifyJWT, editProfile)
userRouter.get("/getuser", verifyJWT, getUser )
export { userRouter }