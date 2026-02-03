import Product from "../../models/productModel.js";

const deleteProduct = async (req, res) => {
  try {
    const adminId = req.userId;
    const { productId, customerId } = req.body;

    if (!productId || !customerId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Delete product with ownership check
    const product = await Product.findOneAndDelete({
      _id: productId,
      customerId,
      adminId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      productId,
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default deleteProduct;
