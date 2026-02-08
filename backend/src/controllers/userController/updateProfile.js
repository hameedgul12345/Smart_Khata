import User from "../../models/userModel.js";
import { uploadOnCloudinary } from "../../config/cloudinary.js";

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, shopName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and shopName if provided
    if (name) user.name = name;
    if (shopName) user.shopName = shopName;

    // Handle profile picture upload
    if (req.file?.buffer) {
      const result = await uploadOnCloudinary(req.file.buffer);
      user.profilePicture = result.secure_url;
      console.log("Profile picture URL:", user.profilePicture);
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default updateProfile;
