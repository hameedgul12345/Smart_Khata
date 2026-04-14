const signout = (req, res) => {
  try {
    res.clearCookie("token"); // same name as your login cookie

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export default signout;