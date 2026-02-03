import Product from "../../models/productModel.js";

const getAllProducts = async (req, res) => {
  try {
    const adminId = req.userId; // must be set by JWT middleware
    const customerId = req.params.customerId;

    if (!adminId || !customerId) {
      return res.status(400).json({
        success: false,
        message: "Missing adminId or customerId",
      });
    }

    const products = await Product.find({ adminId, customerId });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default getAllProducts;
