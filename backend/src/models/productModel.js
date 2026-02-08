import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     availability: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
    name: { type: String, required: true },
    price: { type: Number, required: true },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

// 🔥 Update status automatically before saving
productSchema.pre("save", function (next) {
  if (this.quantity > 0) {
    this.status = "In Stock";
  } else {
    this.status = "Out of Stock";
  }
  next();
});

export default mongoose.model("Product", productSchema);
