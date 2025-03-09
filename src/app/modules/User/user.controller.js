import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";

const createBuyer = catchAsync(async (req, res) => {
  const buyer = req.body;

  const result = await UserServices.createBuyerIntoDB(buyer);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer has been created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const admin = req.body;

  const result = await UserServices.createAdminIntoDB(admin);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin has been created successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status is updated successfully",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getUsers(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  
  const result = await UserServices.getMe(userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});


export const UserControllers = {
  createBuyer,
  createAdmin,
  changeStatus,
  getUsers,
  getMe,
};
