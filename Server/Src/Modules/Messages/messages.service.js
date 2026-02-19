import {
  throwError,
  checkToken,
  getUserMessages,
  insertMessage,

} from "../../index.js";

export async function getMessages(token) {
  try {
    const user = await checkToken(token);
    const messages = await getUserMessages(user.id);
    return { message: "Messages retrieved", data: messages };
  } catch (error) {
    throwError(error.status || 500, error.message);
  }
}

export async function sendMessage(data) {
  try {
    const message = await insertMessage(data.recipientId, data.content);
    return { message: "Message sent successfully", data: message };
  } catch (error) {
    throwError(error.status || 500, error.message);
  }
}
