import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("Admin already exists");
      return; // ✅ just return, DO NOT exit
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);


    
    const admin = await User.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      plan: "pro",
      subscriptionStatus: "active",
    });

    console.log("Admin created:", admin.email);

  } catch (error) {
    console.error("Admin creation error:", error.message);
    // ❌ DO NOT exit here
  }
};

export default createAdmin;