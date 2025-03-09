import express from "express";
import { AdminController } from "./admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/get-admins", AdminController.getAdmins);
adminRouter.get("/:id", AdminController.getSingleAdmin);
adminRouter.patch("/:id", AdminController.updateAdmin)
adminRouter.post("/permission", AdminController.updatePermission)
adminRouter.delete("/:id", AdminController.deleteAdmin);
adminRouter.delete("/block/:id", AdminController.blockAdmin);

export const AdminRoutes = adminRouter;