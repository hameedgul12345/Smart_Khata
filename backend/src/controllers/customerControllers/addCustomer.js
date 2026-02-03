import Customer from "../../models/customerModel.js";

const addCustomer = async (req, res) => {
  try {
    const { name, phone, due } = req.body;

    // 1️⃣ Validate input
    if (!name) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    // 2️⃣ Check if customer already exists for this admin
    const existingCustomer = await Customer.findOne({
      name,
      adminId: req.userId,
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer already exists",
      });
    }

    // 3️⃣ Create customer
    const customer = await Customer.create({
      adminId: req.userId, // from isAuthenticated middleware
      name,
      phone,
      totalDue: due || 0,
    });

    res.status(201).json({
      message: "Customer added successfully",
      customer,
    });

  } catch (error) {
    console.error("Add customer error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export default addCustomer;
