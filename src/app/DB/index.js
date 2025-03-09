import mongoose from "mongoose";
import config from "../config/index.js";
import { SuperAdmin } from "../modules/admin/admin.model.js";
import USER_ROLE from "../modules/User/user.constant.js";
import { User } from "../modules/User/user.model.js";

const superUser = {
  id: "SA-0001",
  email: "shuyibesiddikif@gmail.com",
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if super admin already exists
    const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin }).session(session);

    console.log('super admin: >>>>>>>', isSuperAdminExists);

    if (!isSuperAdminExists) {
      // Create new user
      const newUser = await User.create([superUser], { session });

      // Create new super admin
      const data = {
        id: newUser[0].id,
        userId: newUser[0]._id,
      };
      const superAdmin = await SuperAdmin.create([data], { session });
      console.log('seed super admin: ....>>>', superAdmin);
    }

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

export default seedSuperAdmin;

