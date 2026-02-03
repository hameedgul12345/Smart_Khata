import mongoose from "mongoose";
import Customer from '../../models/customerModel.js';

const getAllCustomers = async (req, res) => {
  try {
    // adminId from middleware
    // console.log("Request", req.userId);

    if (!req.userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    // Convert to ObjectId using 'new'
    const adminId = new mongoose.Types.ObjectId(req.userId);
    // console.log("Fetching customers for adminId:", adminId);

    const customers = await Customer.find({ adminId });
    // console.log("Found customers:", customers.length);

    res.status(200).json({
      success: true,
      customers
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching customers"
    });
  }
};

export default getAllCustomers;
