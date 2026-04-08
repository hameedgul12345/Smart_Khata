import Customer from "../../models/customerModel.js";

const deleteItem = async (req, res) => {
  try {
    const { customerId, itemId } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const itemExists = customer.items.some(
      (item) => item._id.toString() === itemId
    );

    if (!itemExists) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Remove item
    customer.items = customer.items.filter(
      (item) => item._id.toString() !== itemId
    );

    // ✅ ALWAYS recalculate totals (NO subtraction)
    const totalAmount = customer.items.reduce(
      (sum, item) => sum + item.total,
      0
    );

    customer.totalAmount = totalAmount;
    customer.totalDue = totalAmount - customer.amountPaid;

    // Extra safety (optional)
    if (customer.totalDue < 0) {
      customer.totalDue = 0;
    }

    await customer.save();

    return res.status(200).json({
      message: "Item deleted successfully",
      customer,
    });

  } catch (error) {
    console.error("Error deleting item:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default deleteItem;