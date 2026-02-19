import { Router } from "express";
import { success, validate } from "../../Common/index.js";
import { signIn, signUp, refreshAccessToken } from "./auth.service.js";
import { signUpSchema, signInSchema } from "./auth.validation.js";

export const router = Router();

router.post("/signUp",validate(signUpSchema), async (req, res, next) => {
  try {
    const userData = await signUp(req.body);
    success(res, 200, userData.message, userData.data);
  } catch (error) {
    next(error);
  }
});

router.post("/signIn",validate(signInSchema), async (req, res, next) => {
  try {
    const userData = await signIn(req.body);
    return success(res, 200, userData.message, userData.data, userData.token);
  } catch (error) {
    next(error); // errorMiddleware handles response
  }
});

router.post("/refreshToken", async (req, res, next) => {
  try {
    const userData = await refreshAccessToken(req.body);
    return success(res, 200, userData.message, userData.data, userData.token);
  } catch (error) {
    next(error);
  }
});
