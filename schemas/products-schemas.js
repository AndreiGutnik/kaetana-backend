import Joi from 'joi';

export const productAddSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': `missing required "title"`,
    'string.base': `"title" must be string`,
  }),
  price: Joi.number().required().messages({
    'any.required': `missing required "price"`,
    'number.base': `"price" must be number`,
  }),
  desc: Joi.string().required().messages({
    'any.required': `missing required "description"`,
    'string.base': `"description" must be string`,
  }),
});

export const productUpdateSchema = Joi.object({
  title: Joi.string(),
  price: Joi.string(),
  desc: Joi.string(),
});

// export const productFavoriteSchema = Joi.object({
//   favorite: Joi.boolean().required().messages({
//     'any.required': `missing field "favorite"`,
//   }),
// });
