import Product from "../../models/productModel.js";
import Customer from "../../models/customerModel.js";

const addProduct = async (req, res) => {
  try {
    const adminId = req.userId; // set by auth middleware
    const { customerId, productName, price } = req.body;

    // console.log("adminId:", adminId);
    // console.log("customerId:", customerId);

    if (!adminId || !customerId || !productName || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Update customer's totalDue
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { totalDue: Number(price) } },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 2️⃣ Create product
    const product = await Product.create({
      adminId,
      customerId,
      name: productName,
      price: Number(price),
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
      customerTotalDue: customer.totalDue,
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default addProduct;
