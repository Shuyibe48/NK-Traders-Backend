// import { Property } from "../property/property.model.js";
import USER_ROLE from "./user.constant.js";
import { User } from "./user.model.js";

const findLastBuyerId = async () => {
  try {
    const lastBuyer = await User.findOne(
      {
        role: USER_ROLE.buyer,
      },
      { id: 1, _id: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    // যদি lastBuyer পাওয়া না যায়, তবে undefined ফেরত দেবে
    if (!lastBuyer || !lastBuyer.id) {
      return undefined;
    }

    // id এর প্রথম দুটি অক্ষর বাদ দিয়ে বাকি অংশটি ফেরত দেওয়া
    return lastBuyer.id.substring(2);
  } catch (error) {
    // কোনো ত্রুটি ঘটলে তা হ্যান্ডেল করা
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching last buyer id."
    );
  }
};


export const generateBuyerId = async () => {
  let currentId = (0).toString();
  const lastBuyerId = await findLastBuyerId();

  if (lastBuyerId) {
    // প্রথম দুটি অক্ষর বাদ দিয়ে সংখ্যাটির অংশটি নেওয়া
    currentId = lastBuyerId.substring(2);
  }

  // বর্তমান id এর পরবর্তী সংখ্যা তৈরি করা
  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  // নতুন id তৈরি করা
  incrementId = `BU-${incrementId}`;

  return incrementId;
};


export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: USER_ROLE.admin,
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({ createdAt: -1 })
    .lean();

  // Check if lastAdmin exists and return the id part after 'AD-' prefix
  return lastAdmin?.id ? lastAdmin.id.slice(3) : undefined;
};


export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.slice(3); // Use slice instead of substring
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

  incrementId = `AD-${incrementId}`;
  return incrementId;
};


// const findLastPropertyId = async () => {
//   const lastProperty = await Property.findOne().sort({ createdAt: -1 }).lean();

//   return lastProperty?.id ? lastProperty.id.slice(2) : undefined; // Use slice instead of substring
// };


// export const generatePropertyId = async () => {
//   let currentId = (0).toString();
//   const lastPropertyId = await findLastPropertyId();

//   if (lastPropertyId) {
//     currentId = lastPropertyId.slice(3); // Use slice instead of substring
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

//   incrementId = `PR-${incrementId}`;
//   return incrementId;
// };


