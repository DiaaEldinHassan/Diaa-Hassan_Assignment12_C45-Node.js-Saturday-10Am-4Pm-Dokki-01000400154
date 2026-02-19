import { role } from "../Enums/index.js";
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      res.status(400).json({ success: false, errors: { error } });
    }
    next();
  };
};


