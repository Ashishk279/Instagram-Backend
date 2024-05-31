import {User} from "../models/user.model.js"
import {OTP} from "../models/otp.model.js"
import {ApiError} from "../utils/apiErrors.js"
import { BAD_REQUEST } from "../utils/responseCode.js"
import {generateOtpEmail} from "./otp.js"
import { i18n } from "../utils/i18n.js"
const createUser = async(inputs, hashPassword) =>{
    let user;
    user = await User.findOne({email: inputs.email, isEmailVarified: true});
    if(!user){
        let otpuser 
        otpuser = await OTP.findOne({email: inputs.email});
        if(!otpuser){
            await generateOtpEmail(inputs)
            user = await User.create({username: inputs.username, email: inputs.email, fullName: inputs.fullName, password: hashPassword})
        }else{
            const value = i18n.__("already_exists")
            throw new ApiError(BAD_REQUEST, value )
        }
    }else{
        const value = i18n.__("already_exists")
        throw new ApiError(BAD_REQUEST, value )
    }
}

export {
    createUser
}