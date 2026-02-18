import Customer from "../../models/customerModel.js";
import Item from "../../models/itemModel.js";
import Sale from "../../models/saleModel.js";

const addItems = async (req, res) => {
  try {
    const adminId = req.userId;
    const customerId = req.params.id;
    const { itemId, quantity } = req.body;

    // ✅ validation
    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid item or quantity" });
    }

    // ✅ find item
    const item = await Item.findOne({ _id: itemId, adminId });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // ✅ find customer
    const customer = await Customer.findOne({ _id: customerId, adminId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ prepare item entry
    const itemEntry = {
      itemId: item._id,
      itemName: item.name,
      price: item.price,
      quantity,
      total: item.price * quantity,
      date: new Date(),
    };

    // ✅ add item to customer history
    customer.items.push(itemEntry);
    customer.totalDue = (customer.totalDue || 0) + itemEntry.total;
    customer.totalAmount = (customer.totalAmount || 0) + itemEntry.total;
    await customer.save();

    // ✅ update stock
    item.quantity -= quantity;
    item.stockStatus = item.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
    item.totalPrice = (item.totalPrice || 0) - itemEntry.total;
    await item.save();

    // ✅ create new sale document (important for reports)
    await Sale.create({
      adminId,
      customerId,
      items: [itemEntry],
      totalAmount: itemEntry.total,
    });

    res.status(200).json({
      message: "Item added successfully",
      item: itemEntry,
    });
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default addItems;