import httpStatus from "http-status";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import config from "../../config/index.js";
// import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";

const loginUser = async (payload) => {
  try {
    // Check if the user exists
    const user = await User.isUserExistById(payload?.id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Check if the user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user has been deleted.");
    }

    // Check if the user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    if (payload?.password !== user?.password) {
      throw new AppError(httpStatus.FORBIDDEN, "Password does not match.");
    }

    // Create JWT payload
    const jwtPayload = { userId: user?.id, role: user?.role };

    // Generate access token
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in
    );

    // Generate refresh token
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error during user login:", error);
    throw error; // Rethrow to ensure error is handled at the caller
  }
};

const changePassword = async (userData, payload) => {
  try {
    // Check if user exists
    const user = await User.isUserExist(userData?.userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    // Check if user is deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user has been deleted.");
    }

    // Check if user is blocked
    if (user?.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    if (payload?.oldPassword !== user?.password) {
      throw new AppError(httpStatus.FORBIDDEN, "Old password does not match.");
    }

    // Validate the new password (optional)
    if (!payload?.newPassword || payload.newPassword.length < 8) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "New password must be at least 8 characters long."
      );
    }

    await User.findOneAndUpdate(
      { id: userData.userId, role: userData.role },
      { password: payload?.newPassword, passwordChangedAt: new Date() }
    );

    return { message: "Password successfully updated." };
  } catch (error) {
    console.error("Error while changing password:", error);
    throw error; // Ensure error is handled at the caller
  }
};

const refreshToken = async (token) => {
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Token is required for authorization."
    );
  }

  let decoded;
  try {
    decoded = verifyToken(token, config.jwt_refresh_secret);
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token."
    );
  }

  const { role, userId, iat } = decoded;

  const user = await User.isUserExistById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user has been deleted.");
  }

  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked.");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Password has been changed. Please log in again."
    );
  }

  const jwtPayload = { userId: user?.id, role: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );

  return { accessToken };
};

const forgetPassword = async (userId) => {
  const user = await User.isUserExist(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user has been deleted.");
  }

  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked.");
  }

  const jwtPayload = { userId: user?.id, role: user?.role };

  // Create a reset token with 10 minutes expiration
  const resetToken = createToken(jwtPayload, config.jwt_access_secret, "10m");

  const resetUILink = `${config.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

  // Send email to the user with the reset link
  sendEmail(user?.email, resetUILink);
};

const resetPassword = async (payload, token) => {
  const { id, newPassword } = payload;
  const user = await User.isUserExist(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user has been deleted.");
  }

  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt_access_secret);
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token.");
  }

  // Check if the userId in the token matches the payload's id
  if (id !== decoded?.userId) {
    throw new AppError(httpStatus.FORBIDDEN, "User ID mismatch.");
  }

  // Validate the new password
  if (newPassword.length < 8) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password must be at least 8 characters."
    );
  }

  await User.findOneAndUpdate(
    { id: decoded?.userId, role: decoded?.role },
    {
      password: newPassword,
      passwordChangedAt: new Date(),
    }
  );

  return { message: "Password reset successful." };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
