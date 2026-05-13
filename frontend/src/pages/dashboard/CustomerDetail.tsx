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
import {
  Phone,
  Receipt,
  Search,
  Wallet,
  Package,
} from "lucide-react";

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

  const items = useAppSelector(
    (state) => state.items.items
  );

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [customerLoading, setCustomerLoading] =
    useState(true);

  const [dueBoxOpen, setDueBoxOpen] =
    useState(false);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState<Item | null>(null);

  const [itemQty, setItemQty] = useState(1);

  const [loading, setLoading] = useState(false);

  /* SEARCH */
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "ALL" | "IN_STOCK" | "OUT_OF_STOCK"
  >("ALL");

  /* ================= FILTER ================= */

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      item.stockStatus === filter;

    return matchesSearch && matchesFilter;
  });

  /* ================= FETCH ITEMS ================= */

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (items.length === 0) {
          const res = await axios.get(
            `${serverUrl}/api/items/get-items`,
            {
              withCredentials: true,
            }
          );

          dispatch(setItems(res.data.items));
        }
      } catch {
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
        {
          withCredentials: true,
        }
      );

      setCustomer(res.data.customer);
    } catch {
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
        {
          customerId: id,
          amount,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Payment received");

      await fetchCustomer();

      setPaymentAmount("");
      setDueBoxOpen(false);
    } catch {
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
        {
          withCredentials: true,
        }
      );

      toast.success("Item added");

      await fetchCustomer();

      setSelectedItem(null);
      setItemQty(1);
    } catch {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] text-white p-6 space-y-6">

        {/* ================= CUSTOMER ================= */}

        {customerLoading ? (
          <div className="text-slate-400">
            Loading...
          </div>
        ) : (
          customer && (
            <Card className="bg-[#0b1220] border border-white/10">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {customer.name}
                    </h2>

                    <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                      <Phone size={14} />
                      {customer.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-400">
                    Total Due
                  </p>

                  <p
                    className={`text-3xl font-bold ${
                      customer.totalAmount > 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    Rs {customer.totalAmount}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        )}

        {/* ================= ACTIONS ================= */}

        <div className="flex flex-wrap gap-3">

          <Button
            onClick={() => setDueBoxOpen(true)}
            disabled={
              !customer ||
              customer.totalAmount <= 0
            }
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
          >
            <Wallet className="mr-2 w-4 h-4" />
            Take Payment
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              navigate(`/dashboard/view-bill/${id}`)
            }
            className="border-white/10 bg-[#0b1220] text-white hover:bg-white/10"
          >
            <Receipt className="mr-2 w-4 h-4" />
            View Bill
          </Button>
        </div>

        {/* ================= PAYMENT BOX ================= */}

        {dueBoxOpen && (
          <Card className="bg-[#0b1220] border border-white/10">
            <CardContent className="p-4 flex flex-col md:flex-row gap-3">

              <Input
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) =>
                  setPaymentAmount(e.target.value)
                }
                className="bg-[#050816] border-white/10 text-white"
              />

              <Button
                onClick={receivePayment}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Receive
              </Button>

              <Button
                variant="ghost"
                onClick={() => setDueBoxOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================= SEARCH ================= */}

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />

            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-10 bg-[#0b1220] border-white/10 text-white"
            />
          </div>

          <div className="flex gap-2 flex-wrap">

            <Button
              variant={
                filter === "ALL"
                  ? "default"
                  : "outline"
              }
              onClick={() => setFilter("ALL")}
              className={
                filter === "ALL"
                  ? "bg-cyan-500 hover:bg-cyan-600"
                  : "border-white/10 bg-[#0b1220] text-slate-300"
              }
            >
              All
            </Button>

            <Button
              variant={
                filter === "IN_STOCK"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setFilter("IN_STOCK")
              }
              className={
                filter === "IN_STOCK"
                  ? "bg-green-500 hover:bg-green-600"
                  : "border-white/10 bg-[#0b1220] text-slate-300"
              }
            >
              In Stock
            </Button>

            <Button
              variant={
                filter === "OUT_OF_STOCK"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setFilter("OUT_OF_STOCK")
              }
              className={
                filter === "OUT_OF_STOCK"
                  ? "bg-red-500 hover:bg-red-600"
                  : "border-white/10 bg-[#0b1220] text-slate-300"
              }
            >
              Out
            </Button>
          </div>
        </div>

        {/* ================= ITEMS ================= */}

        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No items found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredItems.map((p) => (
              <Card
                key={p._id}
                onClick={() => {
                  if (
                    p.stockStatus ===
                    "OUT_OF_STOCK"
                  )
                    return;

                  setSelectedItem(p);
                }}
                className={`bg-[#0b1220] border border-white/10 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 ${
                  p.stockStatus ===
                  "OUT_OF_STOCK"
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <CardContent className="p-5 space-y-4">

                  {/* TOP */}
                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-semibold text-lg text-white">
                        {p.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Inventory Item
                      </p>
                    </div>

                    <Badge
                      variant={
                        p.stockStatus ===
                        "OUT_OF_STOCK"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {p.stockStatus ===
                      "IN_STOCK"
                        ? "In Stock"
                        : "Out"}
                    </Badge>
                  </div>

                  {/* INFO */}
                  <div className="space-y-2 text-sm">

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
                        Stock
                      </span>

                      <span
                        className={`font-medium ${
                          p.quantity < 5
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {p.quantity}
                      </span>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-slate-400">
                        Total
                      </span>

                      <span className="font-bold text-cyan-300">
                        Rs {p.totalPrice}
                      </span>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ================= MODAL ================= */}

        <Dialog
          open={!!selectedItem}
          onOpenChange={() =>
            setSelectedItem(null)
          }
        >
          <DialogContent className="bg-[#0b1220] border border-white/10 text-white">

            <DialogHeader>
              <DialogTitle className="text-cyan-300">
                Add Item
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-5">

                <div className="bg-[#050816] border border-white/10 rounded-xl p-4">

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {selectedItem.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        Rs {selectedItem.price}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Quantity
                  </label>

                  <Input
                    type="number"
                    value={itemQty}
                    onChange={(e) =>
                      setItemQty(
                        Number(e.target.value)
                      )
                    }
                    className="bg-[#050816] border-white/10 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">

                  <Button
                    variant="ghost"
                    onClick={() =>
                      setSelectedItem(null)
                    }
                    className="text-slate-300 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={
                      handleAddItemToCustomer
                    }
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    {loading
                      ? "Adding..."
                      : "Add Item"}
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