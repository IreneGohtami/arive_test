import Joi from "joi";


export const Error400 = Joi.object({
    statusCode: Joi.number(),
    error: Joi.string(),
    message: Joi.string()
});

export const HobbyModel = Joi.object({
    id: Joi.string(),
    passionLevel: Joi.string(),
    name: Joi.string(),
    year: Joi.number(),
    created: Joi.string(),
    updated: Joi.string()
});

export const UserModel = Joi.object({
    id: Joi.string(),
    name: Joi.string(),
    hobbies: Joi.array(),
    created: Joi.string(),
    updated: Joi.string()
});