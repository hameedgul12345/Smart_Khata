import User from "../../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const userId = req.userId; // coming from auth middleware

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default getUser;
