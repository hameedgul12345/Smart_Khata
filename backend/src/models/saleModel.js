import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        quantity: Number,
        price: Number, // price at time of sale
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
