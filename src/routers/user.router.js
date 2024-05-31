import express from 'express';
import {Signup} from "../controllers/user.controller.js"
const userRouter = express.Router();

userRouter.post("/signup", Signup)
export {userRouter}