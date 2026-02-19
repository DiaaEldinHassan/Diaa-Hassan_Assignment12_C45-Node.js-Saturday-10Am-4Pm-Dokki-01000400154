import { messageModel, userModel } from "./index.js";
import bcrypt from "bcrypt";
import {
  generateAsymmetricKeyPair,
  encryptWithPassword,
  throwError,
  hybridEncrypt,
  hybridDecrypt,
  keyStore,
  role,
  encryption,
  decryption,
} from "../Common/index.js";

export async function createOne(data) {
  const { publicKey, privateKey } = generateAsymmetricKeyPair();

  if (data.provider === "google") {

    return await userModel.create({
      userName: data.username,
      email: data.email,
      googleId: data.googleId,
      provider: "google",
      publicKey,
      encryptedPrivateKey: privateKey, 
      role: role.User,
      profileImage: data.picture,
      phone: [],
    });
  }

  const phoneArray = Array.isArray(data.phone) ? data.phone : [];
  const encrypted = encryptWithPassword(privateKey, data.password);
  const encryptedPhone = encryption(phoneArray);

  return await userModel.create({
    userName: data.username,
    email: data.email,
    password: data.password,
    phone: encryptedPhone,
    role: data.role || role.User,
    provider: "local",
    publicKey,
    encryptedPrivateKey: encrypted.encryptedData,
    encryptionSalt: encrypted.salt,
    encryptionIv: encrypted.iv,
  });
}


export async function findOne(filter = {}, select = {}, options = {}) {
  const userData = await userModel.findOne(filter);
  if (!userData) return null;
  
  if (userData.phone && Array.isArray(userData.phone) && userData.phone.length > 0) {
    userData.phone = decryption(userData.phone);
  }
  return userData;
}

export async function getUserMessages(id) {
  const privateKey = keyStore.get(id.toString());
  if (!privateKey)
    throwError(401, "Private key not found (user not logged in)");

  const messages = await messageModel.find({ recipientId: id });
  if (!messages.length) return [];

  return hybridDecrypt(messages, privateKey);
}

export async function insertMessage(recipientId, content) {
  if (!content || content.length === 0)
    throwError(400, "Please provide a message");

  const recipient = await userModel.findById(recipientId);
  if (!recipient) throwError(404, "Recipient not found");

  const encrypted = hybridEncrypt(content, recipient.publicKey);

  return await messageModel.create({
    recipientId,
    content: encrypted.encryptedContent,
    encryptedKey: encrypted.encryptedKey,
    iv: encrypted.iv,
  });
}
