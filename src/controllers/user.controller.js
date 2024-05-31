import { validateSignup } from "../validations/user.js";
import { hashPasswordUsingBcrypt } from "../utils/utility.js";
import { createUser } from "../services/user.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { OK } from "../utils/responseCode.js";
import { i18n } from "../utils/i18n.js";

const Signup = async (req, res, next) => {
    try {
        const { username, email, name, password } = req.body;
        await validateSignup(req.body);
        const hashPassword = await hashPasswordUsingBcrypt(password);
        const newUser = await createUser(req.body, hashPassword);
        return res.status(OK).json(new ApiResponse(OK, newUser, i18n.__("send_otp")))
    } catch (err) {
        next(err)

    }
}

export {
    Signup
}