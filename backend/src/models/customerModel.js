import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String },
    totalDue: { type: Number}, // total due
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
