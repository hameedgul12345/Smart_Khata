import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    totalDue: {
      type: Number,
      default: 0, // total udhar
      min: 0,
    },
   totalAmount: {
      type: Number,
      default: 0, // total amount of all transactions
      min: 0,
    },
    amountPaid: { 
      type: Number,
      default: 0, // total amount paid by customer
      min: 0,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },

        itemName: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        total: {
          type: Number,
          required: true,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
