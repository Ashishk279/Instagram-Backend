import bcrypt from 'bcrypt';
import otpGenerator from "otp-generator";
import jwt from 'jsonwebtoken'

export const hashPasswordUsingBcrypt = async (password) => {
    return bcrypt.hash(password, 10)
}

export const comparePasswordUsingBcrypt = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

export const generateOTP = () => {
    return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

export const expiredAt = () => {
    return new Date(new Date(Date.now() + 5 * 60 * 1000));
}

export const generateAccessToken = async (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

export const generateRefershToken = async(user) => {
    return jwt.sign({
        _id: user._id,
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}


export const jwtVerify = async(token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

