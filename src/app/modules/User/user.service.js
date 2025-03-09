import mongoose from "mongoose";
import { Buyer } from "../buyer/buyer.model.js";
import { User } from "./user.model.js";
import {
  generateAdminId,
  generateBuyerId,
} from "./user.utils.js";
import AppError from "../../errors/AppError.js";
import httpStatus from "http-status";
import { Admin, SuperAdmin } from "../admin/admin.model.js";
import USER_ROLE from "./user.constant.js";

const createBuyerIntoDB = async (buyer) => {
  const userData = {};

  userData.password = buyer?.password;
  userData.role = USER_ROLE.buyer;
  userData.email = buyer?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateBuyerId();

    console.log(userData.id);

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    buyer.id = newUser[0].id;
    buyer.userId = newUser[0]._id;

    const newBuyer = await Buyer.create([buyer], { session });

    if (!newBuyer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create buyer");
    }

    await session.commitTransaction();
    await session.endSession();

    return newBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const createAdminIntoDB = async (admin) => {
  const userData = {};

  userData.password = admin?.password;
  userData.role = "3";
  userData.email = admin?.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    userData.id = await generateAdminId();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    admin.id = newUser[0].id;
    admin.userId = newUser[0]._id;

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const changeStatus = async (id, payload) => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid ID");
    }
    const result = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
      throw new Error("User not found");
    }
    return result;
  } catch (error) {
    console.error("Error in changeStatus:", error);
    throw new Error("Error updating status");
  }
};

// Improved getUsers function with error handling and performance optimization
const getUsers = async (id) => {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("Invalid ID");
    }
    const result = await User.find({ _id: id }).populate("appointments");
    if (!result.length) {
      throw new Error("No users found");
    }
    return result;
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw new Error("Error fetching users");
  }
};


const getMe = async (userId, role) => {
  try {
    if (!userId || !role) {
      throw new Error("Invalid userId or role");
    }

    let result = null;

    switch (role) {
      case "1":
        result = await Buyer.findOne({ id: userId })
          .populate("userId")
        break;

      case "2":
        result = await Admin.findOne({ id: userId }).populate("userId");
        break;

      case "3":
        result = await SuperAdmin.findOne({ id: userId }).populate("userId");
        break;

      default:
        throw new Error("Invalid role");
    }

    if (!result) {
      throw new Error("User not found");
    }

    return result;
  } catch (error) {
    console.error("Error in getMe:", error);
    throw new Error("Error fetching user data");
  }
};

export const UserServices = {
  createBuyerIntoDB,
  createAdminIntoDB,
  changeStatus,
  getUsers,
  getMe,
};
