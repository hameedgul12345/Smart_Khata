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

        itemName: {
          type: String, // snapshot of name
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number, // price at sale time
          required: true,
        },

        total: {
          type: Number, // quantity × price
          required: true,
        },
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