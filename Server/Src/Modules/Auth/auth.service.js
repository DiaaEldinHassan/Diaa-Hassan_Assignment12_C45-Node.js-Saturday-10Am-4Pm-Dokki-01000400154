import {
  duplicateError,
  generateToken,
  hashCompare,
  throwError,
  decryptWithPassword,
  keyStore,
  generateOTP,
  sendOTPEmail,
  googleVerification,
  verifyToken,
} from "../../Common/index.js";
import { createOne, findOne } from "../../DB/index.js";

export async function signUp(userData) {
  try {
    delete userData.cPassword;
    if (
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.phone
    ) {
      throwError(404, "Data not found");
    }
    const newUser = await createOne(userData);
    const userObj = newUser.toObject();
    delete userObj.password;
    const otp = await generateOTP(newUser._id);
    await sendOTPEmail(newUser.email, otp);
    return { message: "New User Created Successfully", data: userObj };
  } catch (error) {
    if (error.code === 11000) duplicateError();
    throwError(error.status || 400, error.message);
  }
}

export async function signIn(userData) {
  if (userData.token) {
    try {
      const googleData = await googleVerification(userData.token);
      const { email, username } = googleData;

      let user = await findOne({ email });
        
      if (!user || user===null) {
        user = await createOne({
          username,
          email,
          provider: "google",
          isVerified: true,
          phone: [],
        });
      }

      const userObj = user.toObject ? user.toObject() : user;
      delete userObj.password;

      const token = await generateToken({ user: userObj });
      return { message: "Logged in with Google", data: userObj, token };
    } catch (error) {
      throwError(error.status || 500, error.message || "Google Signin error");
    }
  }
  if (!userData.email || !userData.password)
    throw { status: 401, message: "Please complete your credentials" };

  const user = await findOne({ email: userData.email });
  if (!user) throw { status: 401, message: "User does not exist" };

  const verifyUser = await hashCompare(userData.password, user.password);
  if (!verifyUser) throw { status: 401, message: "Incorrect password" };

  user.password = undefined;
  const token = await generateToken({ user });

  const privateKey = decryptWithPassword(
    user.encryptedPrivateKey,
    userData.password,
    user.encryptionIv,
    user.encryptionSalt,
  );
  user.privateKey = privateKey;
  keyStore.set(user._id.toString(), privateKey);

  return { message: "Logged in", data: user, token };
}

export async function refreshAccessToken(tokenData) {
  try {
    if (!tokenData.token) {
      throwError(401, "Refresh token is required");
    }

    const payload = await verifyToken(tokenData.token);
    const user = await findOne({ _id: payload.id });
    
    if (!user) {
      throwError(401, "User not found");
    }

    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;

    const newToken = await generateToken({ user: userObj });
    return { message: "Token refreshed", data: userObj, token: newToken };
  } catch (error) {
    throwError(error.status || 401, error.message || "Token refresh failed");
  }
}
