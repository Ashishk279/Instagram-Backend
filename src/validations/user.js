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
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateVerify = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        email: Joi.string().email().required(),
        otp: Joi.string().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}
const validateResend = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        email: Joi.string().email().required(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateDetails = async (inputs, localPath) => {
    let schema = {}
    schema = Joi.object().keys({
        profilePicture: Joi.string().required(),
        bio: Joi.string().min(10).max(300).optional()
    })
    try {
        await schema.validateAsync({profilePicture: localPath.originalname, bio: inputs.bio}, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateLogin = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}


export {
    validateSignup,
    validateVerify,
    validateResend,
    validateDetails,
    validateLogin
}