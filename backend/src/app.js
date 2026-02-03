import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import connectDB from "./config/db.js";

// Load env variables
dotenv.config();

// Connect Database
connectDB();

// Create express app
const app = express();

/* ================== MIDDLEWARES ================== */

// Body parser (JSON)
app.use(express.json());

// Body parser (form data)
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
  origin: "http://localhost:5173", // or your frontend URL
  credentials: true
}));


// Static folder (for uploads, public files)
app.use("/public", express.static("public"));

/* ================== ROUTES ================== */

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Example routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

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

/* ================== SERVER ================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
