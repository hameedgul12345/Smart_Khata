import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";
import { serverUrl } from "../../App";
import { toast } from "sonner";

/* SHADCN */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

/* ICONS */
import { Phone, Receipt } from "lucide-react";

/* ================= TYPES ================= */
interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
}

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalAmount: number;
}

/* ================= COMPONENT ================= */
function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [dueBoxOpen, setDueBoxOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemQty, setItemQty] = useState(1);
  const [loading, setLoading] = useState(false);

  /* 🔍 SEARCH + FILTER */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "IN_STOCK" | "OUT_OF_STOCK">("ALL");

  /* ================= FILTER LOGIC ================= */
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || item.stockStatus === filter;

    return matchesSearch && matchesFilter;
  });

  /* ================= FETCH ITEMS ================= */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (items.length === 0) {
          const res = await axios.get(
            `${serverUrl}/api/items/get-items`,
            { withCredentials: true }
          );
          dispatch(setItems(res.data.items));
        }
      } catch (err) {
        toast.error("Failed to fetch items");
      }
    };

    fetchItems();
  }, [items.length, dispatch]);

  /* ================= FETCH CUSTOMER ================= */
  const fetchCustomer = async () => {
    try {
      setCustomerLoading(true);
      const res = await axios.get(
        `${serverUrl}/api/customers/${id}`,
        { withCredentials: true }
      );
      setCustomer(res.data.customer);
    } catch (err) {
      toast.error("Failed to load customer");
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  /* ================= RECEIVE PAYMENT ================= */
  const receivePayment = async () => {
    if (!paymentAmount || !customer) return;

    const amount = Number(paymentAmount);

    if (amount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    if (amount > customer.totalAmount) {
      toast.error("Amount exceeds due");
      return;
    }

    try {
      await axios.put(
        `${serverUrl}/api/customers/update-due`,
        { customerId: id, amount },
        { withCredentials: true }
      );

      toast.success("Payment received");

      await fetchCustomer();
      setPaymentAmount("");
      setDueBoxOpen(false);
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  /* ================= ADD ITEM ================= */
  const handleAddItemToCustomer = async () => {
    if (!selectedItem) return;

    if (itemQty <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (itemQty > selectedItem.quantity) {
      toast.error("Not enough stock");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/customers/add-items-to/${id}`,
        {
          itemId: selectedItem._id,
          quantity: itemQty,
        },
        { withCredentials: true }
      );

      toast.success("Item added");

      await fetchCustomer();
      setSelectedItem(null);
      setItemQty(1);
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* CUSTOMER */}
        {customerLoading ? (
          <p>Loading...</p>
        ) : (
          customer && (
            <Card>
              <CardContent className="flex justify-between p-5">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone size={14} /> {customer.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Due</p>
                  <p className={`text-2xl font-bold ${
                    customer.totalAmount > 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    Rs {customer.totalAmount}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* ACTIONS */}
        <div className="flex justify-between gap-3">
          <Button
            onClick={() => setDueBoxOpen(true)}
            disabled={!customer || customer.totalAmount <= 0}
          >
            Take Payment
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/view-bill/${id}`)}
          >
            <Receipt className="mr-2 w-4 h-4" />
            View Bill
          </Button>
        </div>

        {/* PAYMENT */}
        {dueBoxOpen && (
          <Card>
            <CardContent className="flex gap-3 p-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <Button onClick={receivePayment}>
                Receive
              </Button>
              <Button variant="ghost" onClick={() => setDueBoxOpen(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 🔍 SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            <Button variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>
              All
            </Button>
            <Button variant={filter === "IN_STOCK" ? "default" : "outline"} onClick={() => setFilter("IN_STOCK")}>
              In Stock
            </Button>
            <Button variant={filter === "OUT_OF_STOCK" ? "default" : "outline"} onClick={() => setFilter("OUT_OF_STOCK")}>
              Out
            </Button>
          </div>
        </div>

        {/* ITEMS */}
        {filteredItems.length === 0 ? (
          <p className="text-center text-muted-foreground">No items found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredItems.map((p) => (
              <Card
                key={p._id}
                onClick={() => {
                  if (p.stockStatus === "OUT_OF_STOCK") return;
                  setSelectedItem(p);
                }}
                className="cursor-pointer hover:shadow-lg"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{p.name}</h3>
                    <Badge variant={p.stockStatus === "OUT_OF_STOCK" ? "destructive" : "default"}>
                      {p.stockStatus}
                    </Badge>
                  </div>
                  <p>Price: Rs {p.price}</p>
                  <p>Stock: {p.quantity}</p>
                  <p className="font-bold text-primary">Rs {p.totalPrice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* MODAL */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <p>{selectedItem.name}</p>
                <p>Price: Rs {selectedItem.price}</p>

                <Input
                  type="number"
                  value={itemQty}
                  onChange={(e) => setItemQty(Number(e.target.value))}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItemToCustomer} disabled={loading}>
                    {loading ? "Adding..." : "Add Item"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}

export default CustomerDetail;