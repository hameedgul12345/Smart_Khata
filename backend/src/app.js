// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/authRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import connectDB from "./config/db.js";
// import itemRoutes from "./routes/itemRoutes.js";
// // Load env variables
// dotenv.config();

// // Connect Database
// connectDB();

// // Create express app
// const app = express();

// /* ================== MIDDLEWARES ================== */

// // Body parser (JSON)
// app.use(express.json());

// // Body parser (form data)
// app.use(express.urlencoded({ extended: true }));

// // Cookie parser
// app.use(cookieParser());

// // ✅ Middleware: CORS configuration
// app.use(
//   cors({
//     origin: [
//       "https://smartkhatasystem.netlify.app",
//       "http://localhost:5173", // ✅ keep this for local dev
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );


// // Static folder (for uploads, public files)
// app.use("/public", express.static("public"));

// /* ================== ROUTES ================== */

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Example routes
// app.use("/api/auth", authRoutes);
// app.use("/api/customers", customerRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/products", productRoutes);
// app.use('/api/items', itemRoutes);

// /* ================== ERROR HANDLING ================== */

// // 404 handler
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("Error:", err.message);
//   res.status(500).json({
//     success: false,
//     message: err.message || "Server Error",
//   });
// });

// /* ================== SERVER ================== */

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// export default app;



// server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

/* ================== MIDDLEWARE ================== */

// Body parser for JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Universal CORS handler for all requests including preflight
const allowedOrigins = [
  "https://smartkhatasystem.netlify.app", // production frontend
  "http://localhost:5173",                // local dev
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// Serve static files
app.use("/public", express.static("public"));

/* ================== ROUTES ================== */

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/items", itemRoutes);

/* ================== ERROR HANDLING ================== */

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ================== EXPORT FOR VERCEL ================== */

// Do NOT use app.listen() in production (Vercel handles this)
export default app;

