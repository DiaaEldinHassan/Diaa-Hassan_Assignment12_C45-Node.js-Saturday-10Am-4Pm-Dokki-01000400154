import crypto from "crypto";
import { encryptionSecretKey } from "../../../Config/config.service.js";

export function decryptWithPassword(encryptedData, password, iv, salt) {
  const key = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, "base64"),
    100000,
    32,
    "sha256",
  );
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "base64"),
  );

  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function decryption(encryptedData = []) {
  if (!Array.isArray(encryptedData)) throw new Error("Data must be an array");

  const key = crypto.createHash("sha256").update(encryptionSecretKey).digest();
  const zeroIv = Buffer.alloc(16, 0);

  return encryptedData
    .map((item) => {
      try {
        if (!item) return null;

        let decrypted;

        if (typeof item === "string") {
          try {
            const decipher = crypto.createDecipheriv("aes-256-cbc", key, zeroIv);
            decrypted = decipher.update(item, "base64", "utf-8");
            decrypted += decipher.final("utf-8");
            return decrypted.trim();
          } catch (e) {
            try {
              const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.alloc(16));
              decrypted = decipher.update(item, "hex", "utf-8");
              decrypted += decipher.final("utf-8");
              return decrypted.trim();
            } catch (e2) {
              return null;
            }
          }
        }

        if (item.iv && item.number) {
          if (item.authTag) {
            try {
              const iv = Buffer.from(item.iv, "hex");
              const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
              decipher.setAuthTag(Buffer.from(item.authTag, "hex"));
              decrypted = decipher.update(item.number, "hex", "utf-8");
              decrypted += decipher.final("utf-8");
              return decrypted;
            } catch (e) {
              return null;
            }
          } else {
            try {
              const iv = Buffer.from(item.iv, "base64");
              if (iv.length !== 16) throw new Error("Invalid IV length");
              const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
              decrypted = decipher.update(item.number, "base64", "utf-8");
              decrypted += decipher.final("utf-8");
              return decrypted;
            } catch (e1) {
              try {
                const iv = Buffer.from(item.iv, "hex");
                if (iv.length !== 16) throw new Error("Invalid IV length");
                const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
                decrypted = decipher.update(item.number, "hex", "utf-8");
                decrypted += decipher.final("utf-8");
                return decrypted;
              } catch (e2) {
                return null;
              }
            }
          }
        }

        return null;
      } catch (error) {
        console.error("Decryption failed:", error.message);
        return null;
      }
    })
    .filter((phone) => phone !== null && phone !== "");
}

export function hybridDecrypt(messages, privateKey) {
  return messages.map((message) => {
    const aesKey = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(message.encryptedKey, "base64")
    );

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      aesKey,
      Buffer.from(message.iv, "base64")
    );

    let decrypted = decipher.update(message.content, "base64", "utf8"); 
    decrypted += decipher.final("utf8");

    return {
      ...message._doc,
      content: decrypted, 
    };
  });
}
