import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { BuyerServices } from "./buyer.service.js";

const getBuyers = catchAsync(async (req, res) => {
  const result = await BuyerServices.getBuyers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer is retrieved successfully",
    data: result,
  });
});

const getSingleBuyers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BuyerServices.getSingleBuyers(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer is retrieved successfully",
    data: result,
  });
});

const updateBuyer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { buyer } = req.body;

  const result = await BuyerServices.updateBuyer(id, buyer);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer is updated successfully",
    data: result,
  });
});

const deleteBuyer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BuyerServices.deleteBuyer(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer is deleted successfully",
    data: result,
  });
});

const saveFavoriteProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { propertyId } = req.body;

  const result = await BuyerServices.saveFavoriteProperty(id, propertyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property has been saved successfully",
    data: result,
  });
});

const deleteFavoriteProperty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { propertyId } = req.body;
  const result = await BuyerServices.deleteFavoriteProperty(id, propertyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property is unsaved successfully",
    data: result,
  });
});

const saveSearchHistory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const searchText = req.body;

  const result = await BuyerServices.saveSearchHistory(id, searchText);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Search text has been saved successfully",
    data: result,
  });
});

const blockBuyer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BuyerServices.blockBuyer(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buyer is blocked successfully",
    data: result,
  });
});

export const BuyerController = {
  getBuyers,
  getSingleBuyers,
  updateBuyer,
  deleteBuyer,
  saveFavoriteProperty,
  deleteFavoriteProperty,
  saveSearchHistory,
  blockBuyer,
};
