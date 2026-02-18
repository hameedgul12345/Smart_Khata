import mongoose from "mongoose";
import Sale from "../../models/saleModel.js";

const getStats = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.userId);

    // ✅ Today start and tomorrow start (timezone safe)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const stats = await Sale.aggregate([
      { $match: { adminId, createdAt: { $gte: last30Days } } },

      {
        $facet: {
          // 🔹 Today sale
          todaySale: [
            {
              $match: { createdAt: { $gte: todayStart, $lt: tomorrowStart } },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],

          // 🔹 Last 7 days total
          last7DaysSale: [
            { $match: { createdAt: { $gte: last7Days } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],

          // 🔹 Last 30 days total
          last30DaysSale: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],

          // 🔹 Daily 7-day graph
          daily7Days: [
            { $match: { createdAt: { $gte: last7Days } } },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                    timezone: "Asia/Karachi",
                  },
                },
                total: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],

          // 🔹 Daily 30-day graph
          daily30Days: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                    timezone: "Asia/Karachi",
                  },
                },
                total: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const result = stats[0];

    // ✅ fill missing dates for smooth chart
    const fillDates = (days, data, startDate) => {
      const map = {};
      data.forEach((d) => (map[d._id] = d.total));

      const arr = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const key = date.toISOString().split("T")[0];
        arr.push({ date: key, total: map[key] || 0 });
      }
      return arr;
    };

    res.json({
      todaySale: result.todaySale[0]?.total || 0,
      last7DaysSale: result.last7DaysSale[0]?.total || 0,
      last30DaysSale: result.last30DaysSale[0]?.total || 0,
      daily7Days: fillDates(7, result.daily7Days, last7Days),
      daily30Days: fillDates(30, result.daily30Days, last30Days),
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export default getStats;


// import mongoose from "mongoose";
// import Sale from "../../models/saleModel.js";

// const getStats = async (req, res) => {
//   try {
//     const adminId = new mongoose.Types.ObjectId(req.userId);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const last7Days = new Date();
//     last7Days.setDate(last7Days.getDate() - 6);
//     last7Days.setHours(0, 0, 0, 0);

//     const last30Days = new Date();
//     last30Days.setDate(last30Days.getDate() - 29);
//     last30Days.setHours(0, 0, 0, 0);

//     const stats = await Sale.aggregate([
//       {
//         $match: {
//           adminId,
//           createdAt: { $gte: last30Days },
//         },
//       },

//       {
//         $facet: {
//           // 🔹 Today Sale
//           todaySale: [
//             { $match: { createdAt: { $gte: today } } },
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$totalAmount" },
//               },
//             },
//           ],

//           // 🔹 Last 7 Days Total
//           last7DaysSale: [
//             { $match: { createdAt: { $gte: last7Days } } },
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$totalAmount" },
//               },
//             },
//           ],

//           // 🔹 Last 30 Days Total
//           last30DaysSale: [
//             {
//               $group: {
//                 _id: null,
//                 total: { $sum: "$totalAmount" },
//               },
//             },
//           ],

//           // 🔹 Daily Graph (7 Days)
//           daily7Days: [
//             { $match: { createdAt: { $gte: last7Days } } },
//             {
//               $group: {
//                 _id: {
//                   $dateToString: {
//                     format: "%Y-%m-%d",
//                     date: "$createdAt",
//                     timezone: "Asia/Karachi",
//                   },
//                 },
//                 total: { $sum: "$totalAmount" },
//               },
//             },
//             { $sort: { _id: 1 } },
//           ],

//           // 🔹 Daily Graph (30 Days)
//           daily30Days: [
//             {
//               $group: {
//                 _id: {
//                   $dateToString: {
//                     format: "%Y-%m-%d",
//                     date: "$createdAt",
//                     timezone: "Asia/Karachi",
//                   },
//                 },
//                 total: { $sum: "$totalAmount" },
//               },
//             },
//             { $sort: { _id: 1 } },
//           ],
//         },
//       },
//     ]);

//     const result = stats[0];

//     res.json({
//       todaySale: result.todaySale[0]?.total || 0,
//       last7DaysSale: result.last7DaysSale[0]?.total || 0,
//       last30DaysSale: result.last30DaysSale[0]?.total || 0,
//       daily7Days: result.daily7Days.map(d => ({
//         date: d._id,
//         total: d.total,
//       })),
//       daily30Days: result.daily30Days.map(d => ({
//         date: d._id,
//         total: d.total,
//       })),
//     });

//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// };

// export default getStats;
