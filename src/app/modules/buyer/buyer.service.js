import mongoose from "mongoose";
import { Buyer } from "./buyer.model.js";
import AppError from "../../errors/AppError.js";
import { User } from "../User/user.model.js";
import httpStatus from "http-status";
import { buyerSearchableFields } from "./buyer.constant.js";
import QueryBuilder from "../../builder/QueryBuilder.js";

// const getBuyers = async (query) => {
//   const buyerQuery = new QueryBuilder(Buyer.find().populate("userId"), query)
//     .search(buyerSearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await buyerQuery.modelQuery;

//   return result;
// };
const getBuyers = async (query) => {
  try {
    const buyerQuery = new QueryBuilder(Buyer.find().populate("userId"), query)
      .search(buyerSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await buyerQuery.modelQuery;

    return {
      data: result, // buyers data
      total: result.length, // total buyers count
    };
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching buyers data.");
  }
};


// const getSingleBuyers = async (id) => {
//   const result = await Buyer.findById(id);
//   return result;
// };
const getSingleBuyers = async (id) => {
  try {
    const result = await Buyer.findById(id);

    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Buyer not found!");
    }

    return result;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching buyer.");
  }
};


// const updateBuyer = async (id, payload) => {
//   const { name, ...remainingBuyerData } = payload;

//   const modifiedUpdatedData = { ...remainingBuyerData };

//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }

//   const result = await Buyer.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   })
//     .populate("userId")
//     .populate("favorites");
//   return result;
// };
const updateBuyer = async (id, payload) => {
  try {
    const { name, ...remainingBuyerData } = payload;

    // যদি নাম ফিল্ড থাকে, সেটি শুধু ভ্যালু করা হবে
    const modifiedUpdatedData = { ...remainingBuyerData };

    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedUpdatedData[`name.${key}`] = value;
      }
    }

    // ডেটা আপডেট করা হচ্ছে
    const result = await Buyer.findByIdAndUpdate(id, modifiedUpdatedData, {
      new: true,
      runValidators: true,
    })
      .populate("userId")
      .populate("favorites");

    // যদি রেজাল্ট পাওয়া না যায়
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND, "Buyer not found!");
    }

    return result;
  } catch (error) {
    // কোনো ত্রুটি হলে তা হ্যান্ডেল করা হবে
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating buyer.");
  }
};


const deleteBuyer = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedBuyer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Buyer");
    }

    // get user _id from deletedAdmin
    const userId = deletedBuyer.userId;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted user");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to deleted Buyer");
  }
};

// const saveFavoriteProperty = async (id, propertyId) => {
//   const favoriteProperty = await Buyer.findByIdAndUpdate(
//     id,
//     {
//       $addToSet: { favorites: propertyId },
//     },
//     { upsert: true, new: true }
//   )
//     .populate("userId")
//     .populate("favorites");

//   return favoriteProperty;
// };
const saveFavoriteProperty = async (id, propertyId) => {
  try {
    // সঠিক Buyer পাওয়া যাচ্ছিল কিনা তা চেক করতে হবে
    const favoriteProperty = await Buyer.findByIdAndUpdate(
      id,
      {
        $addToSet: { favorites: propertyId }, // সেটের মধ্যে ডুপ্লিকেট এন্ট্রি বন্ধ রাখবে
      },
      { upsert: true, new: true } // নতুন নথি তৈরি করবে যদি না পাওয়া যায়
    )
      .populate("userId")
      .populate("favorites");

    // যদি নথিটি পাওয়া না যায়
    if (!favoriteProperty) {
      throw new AppError(httpStatus.NOT_FOUND, "Buyer not found!");
    }

    return favoriteProperty;
  } catch (error) {
    // ত্রুটি হলে হ্যান্ডেল করা হবে
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error saving favorite property.");
  }
};


// const deleteFavoriteProperty = async (id, propertyId) => {
//   const favoriteProperty = await Buyer.findByIdAndUpdate(
//     id,
//     {
//       $pull: { favorites: propertyId },
//     },
//     { new: true }
//   )
//     .populate("userId")
//     .populate("favorites");

//   return favoriteProperty;
// };
const deleteFavoriteProperty = async (id, propertyId) => {
  try {
    // সঠিক Buyer পাওয়া যাচ্ছিল কিনা তা চেক করতে হবে
    const favoriteProperty = await Buyer.findByIdAndUpdate(
      id,
      {
        $pull: { favorites: propertyId }, // প্রপার্টি হটানোর জন্য
      },
      { new: true } // নতুনভাবে আপডেট হওয়া নথি ফেরত দিবে
    )
      .populate("userId")
      .populate("favorites");

    // যদি কোনো প্রপার্টি মুছে ফেলা না হয়
    if (!favoriteProperty) {
      throw new AppError(httpStatus.NOT_FOUND, "Buyer not found!");
    }

    return favoriteProperty;
  } catch (error) {
    // ত্রুটি হলে হ্যান্ডেল করা হবে
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error deleting favorite property.");
  }
};


// const saveSearchHistory = async (id, searchText) => {
//   const searchHistory = await Buyer.findByIdAndUpdate(
//     id,
//     {
//       $addToSet: { searchHistory: searchText },
//     },
//     { upsert: true, new: true }
//   );

//   return searchHistory;
// };

const saveSearchHistory = async (id, searchText) => {
  try {
    // Buyer ডকুমেন্টের সাথে খুঁজে পাওয়া যাচ্ছে কিনা তা নিশ্চিত করা
    const searchHistory = await Buyer.findByIdAndUpdate(
      id,
      {
        $addToSet: { searchHistory: searchText }, // ডুপ্লিকেট না হওয়ার জন্য $addToSet
      },
      { upsert: true, new: true } // নতুন ডকুমেন্ট না থাকলে তৈরি হবে এবং নতুন তথ্য ফেরত দিবে
    );

    // যদি searchHistory পাওয়া না যায়, তবে ত্রুটি প্রদান করা হবে
    if (!searchHistory) {
      throw new AppError(httpStatus.NOT_FOUND, "Buyer not found or failed to update search history.");
    }

    return searchHistory;
  } catch (error) {
    // ত্রুটি হ্যান্ডলিং
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error saving search history.");
  }
};


const blockBuyer = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Fetch the current buyer to check the blocked status
    const buyer = await Buyer.findById(id).session(session);

    if (!buyer) {
      throw new AppError(httpStatus.BAD_REQUEST, "Buyer not found");
    }

    // Toggle the blocked status
    const updatedBlockedStatus = !buyer.blocked;

    const blockedBuyer = await Buyer.findByIdAndUpdate(
      id,
      { blocked: updatedBlockedStatus }, // Toggle the status
      { new: true, session }
    );

    // If toggling to true, block the user as well
    if (updatedBlockedStatus) {
      const userId = blockedBuyer.userId;

      const blockedUser = await User.findByIdAndUpdate(
        userId,
        { blocked: true },
        { new: true, session }
      );

      if (!blockedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to block user");
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return blockedBuyer;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Transaction failed");
  }
};

export const BuyerServices = {
  getBuyers,
  getSingleBuyers,
  updateBuyer,
  deleteBuyer,
  saveFavoriteProperty,
  deleteFavoriteProperty,
  saveSearchHistory,
  blockBuyer,
};
