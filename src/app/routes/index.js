import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route.js";
import { BuyerRoutes } from "../modules/buyer/buyer.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { AuthRoutes } from "../modules/Auth/auth.route.js";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/buyers",
    route: BuyerRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
