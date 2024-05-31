import Joi from "joi";
import { BAD_REQUEST } from "../utils/responseCode.js"
import { i18n } from "../utils/i18n.js";
import { ApiError } from "../utils/apiErrors.js";
const validateSignup = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        fullName: Joi.string().max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details? validationError.details.map(detail => detail.message).join(', '): i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

export {
    validateSignup
}