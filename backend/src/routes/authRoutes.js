import express from "express";
import Signup from "../controllers/authControllers/Signup.js";
import Signin from "../controllers/authControllers/Signin.js";

const router = express.Router();

// Signup
router.post("/signup", Signup);

// Login
router.post("/signin", Signin);

export default router;
