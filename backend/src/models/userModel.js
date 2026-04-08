import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    shopName: { type: String },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
profilePicture: { type: String, default: null },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },

    profilePicture: { type: String },

    // 🔐 Admin Control
    isActive: { type: Boolean, default: true },

    // 💳 Subscription
    plan: { 
      type: String, 
      enum: ["free", "basic", "pro"], 
      default: "free" 
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "expired", "trial"],
      default: "trial",
    },
     
    approvalStatus: { type: String, enum: ["pending","approved"], default: "pending" },

    subscriptionExpiresAt: {
      type: Date,
    },

    // 🏪 Multi-tenant support
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],

    // 📊 Tracking
    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);