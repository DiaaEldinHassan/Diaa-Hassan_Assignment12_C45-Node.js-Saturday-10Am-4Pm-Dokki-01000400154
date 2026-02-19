import mongoose from "mongoose";
import { gender, hashing, role } from "../../Common/index.js";

const phoneSchema = new mongoose.Schema({
  iv: { type: String, required: true },
  number: { type: String, required: true },
});

const schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    publicKey: {
      type: String,
      required: true,
    },

    encryptedPrivateKey: {
      type: String,
      required: true,
    },

    encryptionSalt: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    encryptionIv: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },

    gender: {
      type: String,
      enum: Object.values(gender),
      default: gender.Male,
    },

    role: {
      type: String,
      enum: Object.values(role),
      default: role.User,
    },

    phone: {
      type: [phoneSchema],
      default: [],
    },

    googleId: { type: String },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    profileImage: String,
  },
  { timestamps: true, collection: "Users" },
);

schema.pre("save", async function () {
  if (this.provider === "google") return;
  if (!this.isModified("password")) return;
  this.password = await hashing(this.password);
});

export const userModel =
  mongoose.models.Users || mongoose.model("Users", schema);
