import bcrypt from 'bcrypt';
import otpGenerator from "otp-generator"

export const hashPasswordUsingBcrypt = async(password) =>{
    return bcrypt.hash(password, 10)
}

export const generateOTP =() => {
   return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
} 

export const expiredAt = () => {
        return new Date( new Date(Date.now() + 5 * 60 * 1000));
}

