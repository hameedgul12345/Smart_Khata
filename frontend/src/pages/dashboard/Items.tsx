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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ICONS */
import {
  Package,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Pencil,
  Trash2,
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
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalPrice =
    (Number(price) || 0) * (Number(quantity) || 0);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/items/get-items`,
          { withCredentials: true }
        );

        setProducts(res.data.items);
        dispatch(setItems(res.data.items));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !quantity) return;

    const data = {
      name,
      price: Number(price),
      quantity: Number(quantity),
    };

    try {
      if (editingId) {
        const res = await axios.put(
          `${serverUrl}/api/items/update-item/${editingId}`,
          data,
          { withCredentials: true }
        );

        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingId ? res.data.item : p
          )
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
      setPrice("");
      setQuantity("");
      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (p: Product) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${serverUrl}/api/items/${id}`, {
        withCredentials: true,
      });

      setProducts((prev) =>
        prev.filter((p) => p._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-6 space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Package className="text-cyan-400" />
              Inventory
            </h2>

            <p className="text-slate-400 mt-1">
              Manage your inventory items
            </p>
          </div>

          {/* VIEW BUTTONS */}
          <div className="flex gap-2">

            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
              className={
                view === "grid"
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                  : "border-white/10 bg-[#0b1220] text-slate-200 hover:bg-white/10 hover:text-white"
              }
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>

            <Button
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
              className={
                view === "table"
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white border-0"
                  : "border-white/10 bg-[#0b1220] text-slate-200 hover:bg-white/10 hover:text-white"
              }
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Table
            </Button>

          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="relative max-w-md">

          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#0b1220] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
          />
        </div>

        {/* ================= FORM ================= */}
        <Card className="bg-[#0b1220] border border-white/10 text-white shadow-xl">

          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? "Update Item" : "Add New Item"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >

              <Input
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#050816] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
              />

              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className="bg-[#050816] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
              />

              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className="bg-[#050816] border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-cyan-500"
              />

              <Input
                value={`Rs ${totalPrice}`}
                readOnly
                className="bg-[#111827] border-white/10 text-slate-300"
              />

              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {editingId ? "Update" : "Add"}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* ================= GRID VIEW ================= */}
        {view === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((p) => (
              <Card
                key={p._id}
                className="bg-[#0b1220] border border-white/10 text-white hover:border-cyan-500/30 hover:shadow-cyan-500/10 hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-5 space-y-4">

                  {/* TOP */}
                  <div className="flex justify-between items-start gap-3">

                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {p.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        Inventory Item
                      </p>
                    </div>

                    <Badge
                      className={
                        p.stockStatus === "IN_STOCK"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                          : "bg-red-500/20 text-red-300 border border-red-500/20"
                      }
                    >
                      {p.stockStatus === "IN_STOCK"
                        ? "In Stock"
                        : "Out Of Stock"}
                    </Badge>

                  </div>

                  {/* DETAILS */}
                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Price
                      </span>

                      <span className="font-medium text-white">
                        Rs {p.price}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Quantity
                      </span>

                      <span
                        className={`font-medium ${
                          p.quantity < 5
                            ? "text-red-400"
                            : "text-white"
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="font-medium text-slate-300">
                        Total
                      </span>

                      <span className="font-bold text-cyan-400">
                        Rs {p.totalPrice}
                      </span>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(p)}
                      className="flex-1 border-white/10 bg-[#111827] text-slate-200 hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>

                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ================= TABLE VIEW ================= */}
        {view === "table" && (
          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl">

            <table className="w-full text-sm bg-[#0b1220] text-white">

              <thead className="bg-[#111827] text-slate-200">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Total</th>
                  <th className="text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >

                    <td className="p-4 font-medium">
                      {p.name}
                    </td>

                    <td className="text-center">
                      Rs {p.price}
                    </td>

                    <td
                      className={`text-center font-medium ${
                        p.quantity < 5
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {p.quantity}
                    </td>

                    <td className="text-center font-semibold text-cyan-400">
                      Rs {p.totalPrice}
                    </td>

                    <td className="text-center">
                      <Badge
                        className={
                          p.stockStatus === "IN_STOCK"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                            : "bg-red-500/20 text-red-300 border border-red-500/20"
                        }
                      >
                        {p.stockStatus === "IN_STOCK"
                          ? "In Stock"
                          : "Out Of Stock"}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(p)}
                          className="border-white/10 bg-[#111827] text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">

            <Package className="mx-auto mb-4 w-14 h-14 text-slate-500 opacity-50" />

            <h3 className="text-xl font-semibold text-slate-300">
              No items found
            </h3>

            <p className="text-slate-500 mt-2">
              Add inventory items to get started
            </p>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Items;