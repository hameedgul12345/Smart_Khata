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

  /* FETCH */
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

  /* SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !quantity) return;

    const data = {
      name,
      price: Number(price),
      quantity: Number(quantity),
    };

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
  };

  const handleEdit = (p: Product) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setQuantity(p.quantity);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`${serverUrl}/api/items/${id}`, {
      withCredentials: true,
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-6 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">

          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Package className="text-cyan-400" />
              Inventory
            </h2>
            <p className="text-slate-400 mt-1">
              Manage your inventory items
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>

            <Button
              variant={view === "table" ? "default" : "outline"}
              onClick={() => setView("table")}
            >
              <TableIcon className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#0b1220] border-white/10 text-white"
          />
        </div>

        {/* FORM */}
        <Card className="bg-[#0b1220] border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? "Update Item" : "Add New Item"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="grid md:grid-cols-5 gap-4" onSubmit={handleSubmit}>

              <Input
                placeholder="Item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#050816] border-white/10 text-white"
              />

              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="bg-[#050816] border-white/10 text-white"
              />

              <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="bg-[#050816] border-white/10 text-white"
              />

              <Input
                value={`Rs ${totalPrice}`}
                readOnly
                className="bg-[#0b1220] border-white/10 text-slate-300"
              />

              <Button type="submit">
                {editingId ? "Update" : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* GRID */}
        {view === "grid" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((p) => (
              <Card
                key={p._id}
                className="bg-[#0b1220] border-white/10 text-white hover:border-cyan-500/30 transition"
              >
                <CardContent className="p-5 space-y-4">

                  <div className="flex justify-between">
                    <h3 className="font-semibold">{p.name}</h3>

                    <Badge>
                      {p.stockStatus}
                    </Badge>
                  </div>

                  <p className="text-slate-400">
                    Price: Rs {p.price}
                  </p>

                  <p className={p.quantity < 5 ? "text-red-400" : "text-slate-300"}>
                    Qty: {p.quantity}
                  </p>

                  <p className="font-bold text-cyan-400">
                    Total: Rs {p.totalPrice}
                  </p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                      <Pencil size={14} /> Edit
                    </Button>

                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* TABLE */}
        {view === "table" && (
          <div className="overflow-x-auto rounded-xl border border-white/10">

            <table className="w-full text-sm bg-[#0b1220] text-white">

              <thead className="text-slate-300">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((p) => (
                  <tr key={p._id} className="border-t border-white/10 hover:bg-white/5">

                    <td className="p-4">{p.name}</td>
                    <td className="text-center">Rs {p.price}</td>
                    <td className={`text-center ${p.quantity < 5 ? "text-red-400" : ""}`}>
                      {p.quantity}
                    </td>
                    <td className="text-center text-cyan-400">
                      Rs {p.totalPrice}
                    </td>

                    <td className="text-center">
                      <Badge>{p.stockStatus}</Badge>
                    </td>

                    <td className="text-right p-4 flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                        Edit
                      </Button>

                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>
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
          <div className="text-center py-20 text-slate-400">
            <Package className="mx-auto mb-4 w-12 h-12 opacity-40" />
            No items found
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Items;