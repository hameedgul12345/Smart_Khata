import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import addItem from "../controllers/ItemControllers/addItem.js";
import getItems from "../controllers/ItemControllers/getItems.js";
import updateItem from "../controllers/ItemControllers/updateItem.js";
const router = express.Router();

router.post("/add-item", isAuthenticated, addItem);
router.get("/get-items", isAuthenticated, getItems);
router.put("/update-item/:id",isAuthenticated,updateItem);
export default router;
