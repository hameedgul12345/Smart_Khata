import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { DotSquare, MoreVertical } from "lucide-react";

/* ================= TYPES ================= */
interface Product {
  _id: string;
  name: string;
  price: number; // match backend field
  quantity: number;
  totalPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  unit?: string;
  lowStockAlert?: number;
}

/* ================= ITEMS COMPONENT ================= */
const Items = () => {
  const [products, setProducts] = useState<Product[]>([]);
  console.log("products", products);
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auto calculate totalPrice
  const totalPrice = price * quantity;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<{ items: Product[] }>(
          `${serverUrl}/api/items/get-items`,
          { withCredentials: true },
        );
        setProducts(res.data.items);
        dispatch(setItems(res.data.items));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  /* ================= ADD OR UPDATE ITEM ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price < 0 || quantity < 0) return;

    const productData = {
      name,
      price,
      quantity,
      unit: "pcs",
      lowStockAlert: 5,
    };

    try {
      if (editingId) {
        // Update existing item
        console.log(editingId);
        const res = await axios.put<{ item: Product }>(
          `${serverUrl}/api/items/update-item/${editingId}`,
          productData,
          { withCredentials: true },
        );
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? res.data.item : p)),
        );
        setEditingId(null);
      } else {
        // Add new item
        const res = await axios.post<{ item: Product }>(
          `${serverUrl}/api/items/add-item`,
          productData,
          { withCredentials: true },
        );
        setProducts([...products, res.data.item]);
      }

      // Reset form
      setName("");
      setPrice(0);
      setQuantity(0);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  /* ================= EDIT ITEM ================= */
  const handleEdit = (id: string) => {
    const item = products.find((p) => p._id === id);
    if (!item) return;
    setName(item.name);
    setPrice(item.price);
    setQuantity(item.quantity);
    setEditingId(id);
  };

  /* ================= DELETE ITEM ================= */
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${serverUrl}/api/items/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setName("");
        setPrice(0);
        setQuantity(0);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  /* ================= FILTERED PRODUCTS ================= */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Items</h2>

        {/* SEARCH */}
        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full border p-2 rounded shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADD / UPDATE FORM */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? "Update Item" : "Add New Item"}
          </h3>

          {/* FORM FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A9899]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
                required
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A9899]"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A9899]"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>

            {/* TOTAL PRICE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Total
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                value={totalPrice}
                readOnly
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-[#1A9899] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#157f80] transition"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>

        {/* PRODUCT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No products found
            </p>
          )}

          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className={`relative p-5 rounded-xl shadow-md border transition hover:shadow-lg ${
                p.stockStatus === "OUT_OF_STOCK"
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* PRODUCT NAME */}
              <h4 className="text-xl font-bold text-gray-800 mb-3">{p.name}</h4>

              {/* PRODUCT DETAILS */}
              <div className="space-y-1 text-sm text-gray-600 mb-10">
                <p>
                  <span className="font-semibold text-gray-700">Price:</span> $
                  {p.price}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Quantity:</span>{" "}
                  {p.quantity}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Total:</span>{" "}
                  <span className="text-[#1A9899] font-bold">
                    ${p.totalPrice}
                  </span>
                </p>
              </div>

              {/* STATUS BADGE + DOTS */}
              <div className=" flex flex-row justify-between items-center gap-1">
                {/* STATUS BADGE (smaller) */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    p.stockStatus === "OUT_OF_STOCK"
                      ? "bg-red-500 text-white"
                      : "bg-[#1A9899] text-white"
                  }`}
                >
                  {p.stockStatus}
                </span>

                {/* DOTS / ACTION MENU (smaller button) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1">
                      <MoreVertical size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <div className="flex flex-col gap-1 justify-center">
                        <button
                          onClick={() => handleEdit(p._id)}
                          className="text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Items;
