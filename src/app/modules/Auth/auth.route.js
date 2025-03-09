import express from "express";
import { AuthControllers } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import USER_ROLE from "../User/user.constant.js";
const router = express.Router();

router.post("/login", AuthControllers.loginUser);
router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.buyer),
  AuthControllers.changePassword
);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post("/forget-password", AuthControllers.forgetPassword);
router.post("/reset-password", AuthControllers.resetPassword);
router.post("/logout", AuthControllers.logOut)

export const AuthRoutes = router;
