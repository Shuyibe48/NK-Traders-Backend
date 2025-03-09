import { Schema, model } from "mongoose";
// import bcrypt from "bcrypt";
import { UserStatus } from "./user.constant.js";
import { type } from "os";

const userSchema = new Schema(
  {
    id: { type: String, unique: true, required: [true, "Id is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: { type: String, enum: ["1", "2", "3"] },
    status: {
      type: String,
      enum: UserStatus,
      default: "in-progress",
    },
    isDeleted: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// hash password
// userSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, Number(12));
//   next();
// });

// hiding password after hash
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// query middleware
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
userSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Custom static method
userSchema.statics.isUserExistById = async function (id) {
  const existingUser = await User.findOne({ id }).select("+password");
  return existingUser;
};

// Custom static method
userSchema.statics.isUserExist = async function (email) {
  const existingUser = await User.findOne({ email }).select("+password");
  return existingUser;
};

// userSchema.statics.isPasswordMatched = async function (
//   plainTextPassword,
//   hashedPassword
// ) {
//   return await bcrypt.compare(plainTextPassword, hashedPassword);
// };

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamps,
  jwtIssuedTimestamps
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamps).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamps;
};

export const User = model("User", userSchema);
