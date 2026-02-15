import Customer from "../../models/customerModel.js";
import Item from "../../models/itemModel.js";
import Sale from "../../models/saleModel.js";

const addItems = async (req, res) => {
  try {
    const adminId = req.userId;
    const customerId = req.params.id;
    const { itemId, quantity } = req.body;

    if (!itemId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid item or quantity" });
    }

    // 1️⃣ Find item
    const item = await Item.findOne({ _id: itemId, adminId });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // 2️⃣ Find customer
    const customer = await Customer.findOne({ _id: customerId, adminId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // 3️⃣ Prepare customer item entry (MATCH SCHEMA)
    const itemEntry = {
      itemId: item._id,
      itemName: item.name, // ✅ FIX HERE
      price: item.price,
      quantity,
      total: item.price * quantity,
      date: new Date(),
    };

    // 4️⃣ Push item to customer
    customer.items.push(itemEntry);
    //  console.log("added items",items)

    // 5️⃣ Update customer due
    customer.totalDue = (customer.totalDue || 0) + itemEntry.total;
    customer.totalAmount = (customer.totalAmount || 0) + itemEntry.total; // Update total amount

    await customer.save();

    // 6️⃣ Update item stock
    item.quantity -= quantity;
    item.stockStatus = item.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";

    item.totalPrice = item.totalPrice - item.price * quantity;
    await item.save();

    res.status(200).json({
      message: "Item added to customer successfully",
      item: itemEntry,
    });

    const sale = await Sale.findOne({ adminId, customerId });

    if (sale) {
      sale.items.push(itemEntry);
      sale.totalAmount = itemEntry.total + (sale.totalAmount || 0);
      await sale.save();
    } else {
      await Sale.create({
        adminId,
        customerId,
        items: [itemEntry],
        totalAmount: itemEntry.total,
      });
    }

    // 6️⃣ Create sale
    // const sale = await Sale.create({
    //   adminId,
    //   customerId,
    //   items: [itemEntry],
    //   totalAmount: customer.totalAmount,
    // });
  } catch (error) {
    console.error("Error adding item to customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default addItems;

// import mongoose from "mongoose";
// import Customer from "../../models/customerModel.js";
// import Item from "../../models/itemModel.js";

// const addItems = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const adminId = req.userId;
//     const customerId = req.params.id;
//     const { itemId, quantity } = req.body;

//     if (!itemId || !quantity || quantity <= 0) {
//       await session.abortTransaction();
//       return res.status(400).json({ message: "Invalid item or quantity" });
//     }

//     // 1️⃣ Find item
//     const item = await Item.findOne({ _id: itemId, adminId }).session(session);
//     if (!item) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Item not found" });
//     }

//     if (item.quantity < quantity) {
//       await session.abortTransaction();
//       return res.status(400).json({ message: "Not enough stock" });
//     }

//     // 2️⃣ Find customer
//     const customer = await Customer.findOne({ _id: customerId, adminId }).session(session);
//     if (!customer) {
//       await session.abortTransaction();
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     // 3️⃣ Create customer item entry
//     const itemEntry = {
//       itemId: item._id,
//       itemName: item.name,
//       price: item.price,
//       quantity,
//       total: item.price * quantity,
//       date: new Date(),
//     };

//     // 4️⃣ Update customer
//     customer.items.push(itemEntry);
//     customer.totalDue = (customer.totalDue || 0) + itemEntry.total;

//     await customer.save({ session });

//     // 5️⃣ Update item stock
//     item.quantity -= quantity;
//     await item.save({ session });

//     // 6️⃣ Commit transaction
//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       message: "Item added to customer successfully",
//       item: itemEntry,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error adding item to customer:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export default addItems;
