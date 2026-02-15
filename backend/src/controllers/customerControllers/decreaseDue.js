import Customer from "../../models/customerModel.js";

const decreaseDue = async (req, res) => {
  // console.log("hello")
  try {
    const adminId = req.userId;
    const { customerId, amount } = req.body;

    // console.log(customerId,amount)

    if (!customerId || !amount) {
      return res.status(400).json({ message: "customerId and amount are required" });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const customer = await Customer.findOne({
      _id: customerId,
      adminId: adminId
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.totalDue < amount) {
      return res.status(400).json({ message: "Payment amount exceeds total due" });
    }

    // Subtract payment from totalDue
    customer.totalDue = Number(customer.totalDue || 0) - Number(amount);
    customer.amountPaid = (customer.amountPaid || 0) + Number(amount); // Update amount paid

    // Never allow negative due
    if (customer.totalDue < 0) customer.totalDue = 0;

    await customer.save();

    return res.json({
      message: "Payment received successfully",
      newDue: customer.totalDue,   // ✅ FIXED
      customer
    });

  } catch (error) {
    console.error("Decrease due error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default decreaseDue;
