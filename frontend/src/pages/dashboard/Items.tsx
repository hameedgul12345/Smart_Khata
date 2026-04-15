"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";

/* SHADCN */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ICONS */
import {
  Package,
  Search,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";

/* ================= TYPES ================= */
interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
}

/* ================= COMPONENT ================= */
const Items = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalPrice = price * quantity;

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(
        `${serverUrl}/api/items/get-items`,
        { withCredentials: true }
      );
      setProducts(res.data.items);
      dispatch(setItems(res.data.items));
    };

    fetchProducts();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { name, price, quantity };

    if (editingId) {
      const res = await axios.put(
        `${serverUrl}/api/items/update-item/${editingId}`,
        data,
        { withCredentials: true }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editingId ? res.data.item : p))
      );
    } else {
      const res = await axios.post(
        `${serverUrl}/api/items/add-item`,
        data,
        { withCredentials: true }
      );

      setProducts((prev) => [...prev, res.data.item]);
    }

    setName("");
    setPrice(0);
    setQuantity(0);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${serverUrl}/api/items/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <Package className="text-primary" />
            Inventory
          </h2>

          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="w-4 h-4 mr-1" /> Grid
            </Button>

            <Button
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              <TableIcon className="w-4 h-4 mr-1" /> Table
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* FORM */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle>
              {editingId ? "Update Item" : "Add New Item"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-5 gap-4"
            >
              <Input
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              <Input value={totalPrice} readOnly />
              <Button type="submit">
                {editingId ? "Update" : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <Card
                key={p._id}
                className={`transition shadow-md border-0 ${
                  p.quantity < 5 ? "border border-red-300" : ""
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-800">{p.name}</h3>

                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Price</span>
                    <span>Rs {p.price}</span>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span>Qty</span>
                    <span
                      className={
                        p.quantity < 5 ? "text-red-500 font-bold" : ""
                      }
                    >
                      {p.quantity}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t">
                    <span>Total</span>
                    <span className="font-bold text-primary">
                      Rs {p.totalPrice}
                    </span>
                  </div>

                  <Badge
                    variant={
                      p.stockStatus === "OUT_OF_STOCK"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {p.stockStatus}
                  </Badge>

                  <div className="flex justify-between gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(p._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{p.name}</td>
                    <td>Rs {p.price}</td>
                    <td
                      className={
                        p.quantity < 5 ? "text-red-500 font-bold" : ""
                      }
                    >
                      {p.quantity}
                    </td>
                    <td>Rs {p.totalPrice}</td>
                    <td>
                      <Badge
                        variant={
                          p.stockStatus === "OUT_OF_STOCK"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {p.stockStatus}
                      </Badge>
                    </td>
                    <td className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingId(p._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Package className="mx-auto mb-3 w-10 h-10 opacity-50" />
            No items found
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Items;