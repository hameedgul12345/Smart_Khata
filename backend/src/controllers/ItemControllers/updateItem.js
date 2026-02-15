import Item from "../../models/itemModel.js";

const updateItem = async (req, res) => {
  try {
    const adminId = req.userId;
    const itemId = req.params.id;

    // console.log("item id", itemId);

    const { name, price, quantity, unit, lowStockAlert } = req.body;

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, adminId },     // ✅ FILTER ONLY
      {
        name,
        price,
        quantity,
        unit,
        stockStatus: quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
      totalPrice: price * quantity,
        lowStockAlert,
      },                            // ✅ UPDATE DATA
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default updateItem;
