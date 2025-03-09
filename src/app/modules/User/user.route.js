import express from "express";
import { UserControllers } from "./user.controller.js";
import auth from "../../middlewares/auth.js";
import USER_ROLE from "./user.constant.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const userRouter = express.Router();

userRouter.post(
  "/create-buyer", auth(USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.superAdmin),
  // upload.single("file"),
  // (req, res, next) => {
  //   req.body = JSON.parse(req.body.data);
  //   next();
  // },
  UserControllers.createBuyer
);
userRouter.post("/create-admin", auth(USER_ROLE.superAdmin), UserControllers.createAdmin);
userRouter.post("/change-status/:id", auth(USER_ROLE.admin), UserControllers.changeStatus);
userRouter.get("/get-user/:id", auth(USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.superAdmin), UserControllers.getUsers);
userRouter.get("/me", auth(USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.superAdmin), UserControllers.getMe);

export const UserRoutes = userRouter;
