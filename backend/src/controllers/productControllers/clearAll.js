
import Product from "../../models/productModel.js";
import Customer from "../../models/customerModel.js";
const clearAll = async (req, res) => {
  try {
    const adminId = req.userId; // if you need auth later
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    // Delete all products for this customer
    await Product.deleteMany({ customerId });

    // Reset customer's totalDue
    await Customer.findByIdAndUpdate(customerId, {
      totalDue: 0,
    });

    res.status(200).json({
      message: "All products cleared successfully",
    });
  } catch (error) {
    console.error("Clear all products error:", error);
    res.status(500).json({
      message: "Failed to clear products",
    });
  }
};


export default clearAll;