import Item from "../../models/itemModel.js";

const getItems = async (req, res) => {
    // console.log("getItems called");
  try {
    const adminId = req.userId; // get from auth middleware

    // Find all items for this admin
    const items = await Item.find({ adminId });

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getItems;