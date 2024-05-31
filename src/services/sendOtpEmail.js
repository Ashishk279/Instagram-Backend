import { sendEmail } from "../utils/email.js"; 
const sendOtp = async(to, code) =>{
    const subject = "Instagram Account verification";
    let html = `Your One Time OTP is ${code}`;
    await sendEmail(to, subject, html)
}

export {
    sendOtp
}