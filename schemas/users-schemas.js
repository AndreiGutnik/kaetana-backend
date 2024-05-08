import Joi from 'joi';

import { emailRegexp, phoneRegexp } from '../models/user-model.js';

export const userSignupSchema = Joi.object({
  firstname: Joi.string().required().messages({
    'any.required': `missing required "name"`,
    'string.base': `"name" must be string`,
  }),
  lastname: Joi.string().required().messages({
    'any.required': `missing required "lastname"`,
    'string.base': `"lastname" must be string`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `missing required "email"`,
    'string.base': `"email" must be string`,
  }),
  phone: Joi.string().pattern(phoneRegexp).messages({
    'string.base': `"phone" must be string`,
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': `missing required "password"`,
    'string.min': `"password" should have a minimum length of {#limit}`,
  }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

// export const userEmailSchema = Joi.object({
//   email: Joi.string().pattern(emailRegexp).required().messages({
//     "any.required": `missing required field email`,
//   }),
// });

export const updateUserSchema = Joi.object({
  firstname: Joi.string().messages({
    'string.base': `"name" must be string`,
  }),
  lastname: Joi.string().messages({
    'string.base': `"lastname" must be string`,
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    'string.base': `"email" must be string`,
  }),
  phone: Joi.string().pattern(phoneRegexp).messages({
    'string.base': `"phone" must be string`,
  }),
});

// export const userAvatarSchema = Joi.object({
//   avatar: Joi.string().required().messages({
//     "any.required": `missing field "avatar"`,
//   }),
// });
