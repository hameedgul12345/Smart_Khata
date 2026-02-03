import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // price at the time of purchase
    total: { type: Number, required: true }, // price * quantity
    paid: { type: Boolean, default: false }, // if customer has paid or not
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
