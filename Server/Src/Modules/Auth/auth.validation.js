import Joi from "joi";
import { role } from "../../Common/index.js";

export const signUpSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      "string.base": "Username must be a string",
      "string.empty": "Username is required",
      "string.min": "The username length must be at least 3 characters",
      "string.max": "The username length must be at most 50 characters",
      "any.required": "Username is required",
    }),
    password: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*[_@+-])[a-zA-Z0-9._@+-]{8,50}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password should contain at least one special character (_@+-) and one uppercase letter, 8-50 chars",
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
    cPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords must match",
      "any.required": "Confirm Password is required",
    }),
    email: Joi.string()
      .email()
      .pattern(
        /^[a-zA-Z0-9._+-]+@(gmail|yahoo|outlook)\.(com|net)(\.edu|\.eg)?/,
      )
      .required()
      .messages({
        "string.email": "Email must be valid",
        "string.pattern.base":
          "Email provider must be gmail, yahoo, or outlook with optional .edu or .eg",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
    phone: Joi.array()
      .items(Joi.string().length(11))
      .min(1)
      .max(3)
      .unique()
      .required()
      .messages({
        "array.min": "At least one phone number is required",
        "array.max": "At most 3 phone numbers allowed",
        "array.unique": "Phone numbers must be unique",
      }),
    role: Joi.string().valid(role.Admin, role.User).default(role.User),
  }),
  Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "Google token is required",
      "any.required": "Google token is required",
    })
  }),
);

export const signInSchema = Joi.alternatives().try(
  
  Joi.object({
    email: Joi.string()
      .email()
      .pattern(
        /^[a-zA-Z0-9._+-]+@(gmail|yahoo|outlook)\.(com|net)(\.edu|\.eg)?/,
      )
      .required()
      .messages({
        "string.email": "Email must be valid",
        "string.pattern.base":
          "Email provider must be gmail, yahoo, or outlook with optional .edu or .eg",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
    password: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*[_@+-])[a-zA-Z0-9._@+-]{8,50}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Password should contain at least one special character (_@+-) and one uppercase letter, 8-50 chars",
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
  }),

  Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "Google token is required",
      "any.required": "Google token is required",
    }),
  }),
);
