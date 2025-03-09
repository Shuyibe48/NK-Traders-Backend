import { Schema, model, Types } from "mongoose";

const buyerSchema = new Schema(
  {
    id: { type: String, unique: true, required: [true, "Id is required"] },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User id is required"],
      unique: true,
      ref: "User",
    },
    fullName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    contactNo: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property", default: "" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// query middleware
buyerSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
buyerSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// query middleware
buyerSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Custom static method
buyerSchema.statics.isUserExist = async function (id) {
  const existingUser = await Buyer.findOne({ id }); // Use 'this' to refer to the current model
  return existingUser;
};

export const Buyer = model("Buyer", buyerSchema);
