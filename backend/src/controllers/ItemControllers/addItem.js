import User from "../../models/userModel.js";
import Item from "../../models/itemModel.js";

const addItem = async (req, res) => {
  try {
    const adminId = req.userId; // authenticated user ID from middleware
    const { name, price, quantity, unit, lowStockAlert } = req.body;

    // Validate required fields
    if (!name || price == null || quantity == null) {
      return res.status(400).json({ message: "Name, price, and quantity are required" });
    }

    // Validate unit
    const allowedUnits = ["pcs", "kg", "litre", "packet"];
    if (unit && !allowedUnits.includes(unit)) {
      return res.status(400).json({ message: `Unit must be one of: ${allowedUnits.join(", ")}` });
    }

    // Check if user exists
    const user = await User.findById(adminId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate totalPrice
    const totalPrice = price * quantity;

    // Create new item
    const newItem = new Item({
      adminId,
      name,
      price,
      quantity,
      totalPrice,
      unit: unit || "pcs",
      lowStockAlert: lowStockAlert || 5, // default 5
      // stockStatus will auto-update in pre-save hook
    });

    await newItem.save();

    // console.log("Successfully created item:", newItem);
    return res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default addItem;


// import User from "../../models/userModel.js";
// import Item from "../../models/itemModel.js";

// const addItem = async (req, res) => {
//   try {
//     const adminId = req.userId;
//     const { name, price, quantity, unit, lowStockAlert } = req.body;

//     // Basic required validation
//     if (!name || price == null || quantity == null) {
//       return res.status(400).json({
//         message: "Name, price, and quantity are required",
//       });
//     }

//     // Check if user exists
//     const userExists = await User.exists({ _id: adminId });
//     if (!userExists) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Create item (stockStatus handled by schema middleware)
//     const newItem = await Item.create({
//       adminId,
//       name,
//       price,
//       quantity,
//       unit,           // mongoose enum handles validation
//       lowStockAlert,  // default handled by schema
//     });

//     return res.status(201).json({
//       message: "Item added successfully",
//       item: newItem,
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export default addItem;

