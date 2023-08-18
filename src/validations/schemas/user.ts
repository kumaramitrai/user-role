import Joi from 'joi';

const registerUserSchema = Joi.object({
    firstName: Joi.string().required().max(150),
    lastName: Joi.string().required().max(150),
    userRole: Joi.string().optional(),
    email: Joi.string().required().email().max(150),
    password: Joi.string().required(),
});
const loginUserSchema = Joi.object({
    email: Joi.string().required().email().max(150),
    password: Joi.string().required(),
});
const editUserRoleSchema = Joi.object({
    userRole: Joi.string().required(),
});
const deleteUserSchema = Joi.object({
    userID: Joi.string().required(),
});

export { registerUserSchema, loginUserSchema, editUserRoleSchema, deleteUserSchema };
