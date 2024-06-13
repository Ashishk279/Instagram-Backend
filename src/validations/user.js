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

const validatePassword = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        password: Joi.string().min(6).required()
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validatePost = async (inputs) => {
    let schema = {}
    schema = Joi.object().keys({
        title: Joi.string().min(1).required(),
        body: Joi.string().min(1).required(),
        status: Joi.string().valid('draft', 'published', 'archived').optional(),
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateUser = async(inputs) => {
    let schema = {};
    schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20),
        fullName: Joi.string().max(50)
    })
    try {
        await schema.validateAsync(inputs, { abortEarly: false });
    } catch (validationError) {
        const errorMessage = validationError.details ? validationError.details.map(detail => detail.message).join(', ') : i18n.__('invalid_values');
        throw new ApiError(BAD_REQUEST, errorMessage);
    }
}

const validateFollow = async(inputs) => {
    let schema = {};
    schema = Joi.object().keys({
        following_user_id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
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
    validateLogin,
    validatePassword,
    validatePost,
    validateUser,
    validateFollow
}