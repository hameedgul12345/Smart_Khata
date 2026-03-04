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

    if (customer.totalAmount < amount) {
      return res.status(400).json({ message: "Payment amount exceeds total Amount" });
    }
     customer.amountPaid=0;
    // Subtract payment from totalDue
    customer.totalAmount = Number(customer.totalAmount || 0) - Number(amount);
    customer.amountPaid = (customer.amountPaid) + Number(amount); // Update amount paid

    // Never allow negative due
    if (customer.totalAmount < 0) customer.totalAmount = 0;

    await customer.save();

    return res.json({
      message: "Payment received successfully",
      newDue: customer.totalAmount,   // ✅ FIXED
      customer
    });

  } catch (error) {
    console.error("Decrease due error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default decreaseDue;
