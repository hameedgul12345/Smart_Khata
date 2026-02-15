// import mongoose from "mongoose";
// import Sale from "../../models/saleModel.js";

// const getStates = async (req, res) => {
//   try {
//     const adminId = new mongoose.Types.ObjectId(req.userId);

//     // ================= TODAY =================
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);

//     const todaySales = await Sale.aggregate([
//       { $match: { adminId, createdAt: { $gte: today } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     // ================= LAST 7 DAYS =================
//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 7);

//     const weekSales = await Sale.aggregate([
//       { $match: { adminId, createdAt: { $gte: last7Days } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     // ================= LAST 30 DAYS (FIXED) =================
//     const last30Days = new Date();
//     last30Days.setDate(last30Days.getDate() - 30);

//     const monthSales = await Sale.aggregate([
//       { $match: { adminId, createdAt: { $gte: last30Days } } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } },
//     ]);

//     res.json({
//       todaySale: todaySales[0]?.total || 0,
//       last7DaysSale: weekSales[0]?.total || 0,
//       last30DaysSale: monthSales[0]?.total || 0,
//     });

//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// };

// export default getStates;

import mongoose from "mongoose";
import Sale from "../../models/saleModel.js";

const getStates = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.userId);

    // ================= TODAY =================
    const today = new Date();
   today.setHours(0, 0, 0, 0);


    const todaySales = await Sale.aggregate([
      { $match: { adminId, updatedAt: { $gte: today } } },

      // { $match: { adminId, $or: [{ createdAt: { $gte: today } }, { updatedAt: { $gte: today } }] } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
// console.log(todaySales)
    // ================= LAST 7 DAYS =================
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const weekSales = await Sale.aggregate([
      { $match: { adminId, $or: [{ createdAt: { $gte: last7Days } }, { updatedAt: { $gte: last7Days } }] } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
// console.log(weekSales)
    // ================= LAST 30 DAYS =================
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);

    const monthSales = await Sale.aggregate([
      { $match: { adminId, createdAt: { $gte: last30Days } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
// console.log(monthSales)
    // ================= DAILY GRAPH (7 DAYS) =================
    const daily7Days = await Sale.aggregate([
      { $match: { adminId, createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
// console.log(daily7Days)
    // ================= DAILY GRAPH (30 DAYS) =================
    const daily30Days = await Sale.aggregate([
      { $match: { adminId, createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  // console.log(last30Days)
    res.json({
      todaySale: todaySales[0]?.total || 0,
      last7DaysSale: weekSales[0]?.total || 0,
      last30DaysSale: monthSales[0]?.total || 0,
      daily7Days,
      daily30Days,
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export default getStates;

