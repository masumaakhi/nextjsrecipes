import crypto from "crypto";
import Token from "@/models/Token";
import connectDb from "./mongodb";

export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const saveToken = async (userId, token, type, expiresIn = 3600000) => {
  await connectDb();

  // Remove old tokens of same type
  await Token.deleteMany({ userId, type });

  const expiresAt = new Date(Date.now() + expiresIn); // Default 1 hour

  const newToken = new Token({
    userId,
    token,
    type, // e.g. 'verify', 'reset'
    expiresAt,
  });

  await newToken.save();
  return newToken;
};

export const findValidToken = async (token, type) => {
  await connectDb();

  const foundToken = await Token.findOne({
    token,
    type,
    expiresAt: { $gt: new Date() }, // Not expired
  });

  return foundToken;
};

export const deleteToken = async (token, type) => {
  await connectDb();
  await Token.deleteOne({ token, type });
};
