import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";

/* SHADCN UI */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

/* ICONS */
import { MoreVertical, Pencil, Trash2, Package, Search } from "lucide-react";

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
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalPrice = price * quantity;

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

  /* DELETE */
  const handleDelete = async (id: string) => {
    await axios.delete(`${serverUrl}/api/items/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Package className="text-primary" />
            Items
          </h2>

          <Button onClick={() => setEditingId(null)}>
            + Add Item
          </Button>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-md">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Update Item" : "Add New Item"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
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

              <div className="md:col-span-4 flex justify-end">
                <Button type="submit">
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <Card key={p._id} className="hover:shadow-lg transition">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">{p.name}</CardTitle>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEditingId(p._id)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent className="space-y-2">
                <p>Price: ${p.price}</p>
                <p>Quantity: {p.quantity}</p>
                <p className="font-bold text-primary">
                  Total: ${p.totalPrice}
                </p>

                <Badge
                  variant={
                    p.stockStatus === "OUT_OF_STOCK"
                      ? "destructive"
                      : "default"
                  }
                >
                  {p.stockStatus}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground">
            No items found
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Items;