import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    totalPrice: { type: Number, required: true, min: 0 },

    quantity: { type: Number, required: true, default: 0, min: 0 },

    unit: {
      type: String,
      enum: ["pcs", "kg", "litre", "packet"],
      default: "pcs",
    },

    stockStatus: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },

    lowStockAlert: { type: Number, default: 5 },
  },
  { timestamps: true },
);

// ✅ Mongoose 7+ compatible pre-save hook
itemSchema.pre("save", function () {
  this.stockStatus = this.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
});

export default mongoose.model("Item", itemSchema);



// import mongoose from "mongoose";

// const itemSchema = new mongoose.Schema(
//   {
//     adminId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     quantity: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },

//     unit: {
//       type: String,
//       enum: ["pcs", "kg", "litre", "packet"],
//       default: "pcs",
//     },

//     stockStatus: {
//       type: String,
//       enum: ["IN_STOCK", "OUT_OF_STOCK"],
//       default: "IN_STOCK",
//     },

//     lowStockAlert: {
//       type: Number,
//       default: 5,
//       min: 0,
//     },
//   },
//   { timestamps: true }
// );


// // ✅ Virtual Total Price (Not stored in DB)
// itemSchema.virtual("totalPrice").get(function () {
//   return this.price * this.quantity;
// });


// // ✅ Update stock status before save
// itemSchema.pre("save", function () {
//   this.stockStatus = this.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
// });


// // ✅ Update stock status on findOneAndUpdate
// itemSchema.pre("findOneAndUpdate", function () {
//   const update = this.getUpdate();

//   if (update.quantity !== undefined) {
//     update.stockStatus =
//       update.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";
//   }

//   this.setUpdate(update);
// });


// export default mongoose.model("Item", itemSchema);
