import { findOne } from "../../DB/index.js";
import { throwError } from "../../Common/index.js";

export async function userGetData(userData) {
  try {
    const user = await findOne({ _id: userData.id });
    if (!user) {
      throwError(404, "User not found");
    }
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return { message: "User found", data: userObj };
  } catch (error) {
    throwError(error.status || 401, error.message);
  }
}

