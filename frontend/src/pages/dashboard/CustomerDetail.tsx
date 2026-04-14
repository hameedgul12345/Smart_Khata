import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";
import { serverUrl } from "../../App";

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
  const [dueBoxOpen, setDueBoxOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemQty, setItemQty] = useState(1);
  const [loading, setLoading] = useState(false);

  /* FETCH ITEMS */
  useEffect(() => {
    if (items.length === 0) {
      axios
        .get(`${serverUrl}/api/items/get-items`, { withCredentials: true })
        .then((res) => {
          dispatch(setItems(res.data.items));
        });
    }
  }, [items.length, dispatch]);

  /* FETCH CUSTOMER */
  useEffect(() => {
    axios
      .get(`${serverUrl}/api/customers/${id}`, {
        withCredentials: true,
      })
      .then((res) => setCustomer(res.data.customer));
  }, [id]);

  /* RECEIVE PAYMENT */
  const receivePayment = async () => {
    if (!paymentAmount) return;

    await axios.put(
      `${serverUrl}/api/customers/update-due`,
      { customerId: id, amount: Number(paymentAmount) },
      { withCredentials: true }
    );

    setCustomer((prev) =>
      prev
        ? { ...prev, totalAmount: prev.totalAmount - Number(paymentAmount) }
        : prev
    );

    setPaymentAmount("");
    setDueBoxOpen(false);
  };

  /* ADD ITEM */
  const handleAddItemToCustomer = async () => {
    if (!selectedItem) return;

    setLoading(true);

    await axios.post(
      `${serverUrl}/api/customers/add-items-to/${id}`,
      {
        itemId: selectedItem._id,
        quantity: itemQty,
      },
      { withCredentials: true }
    );

    setCustomer((prev) =>
      prev
        ? {
            ...prev,
            totalAmount: prev.totalAmount + selectedItem.price * itemQty,
          }
        : prev
    );

    setSelectedItem(null);
    setItemQty(1);
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* CUSTOMER CARD */}
        {customer && (
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
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
                <p
                  className={`text-xl font-bold ${
                    customer.totalAmount > 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  Rs {customer.totalAmount}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ACTION BAR */}
        <div className="flex justify-end gap-3">
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

        {/* PAYMENT BOX */}
        {dueBoxOpen && (
          <Card>
            <CardContent className="flex gap-3 p-4">
              <Input
                type="number"
                placeholder="Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <Button onClick={receivePayment}>Receive</Button>
              <Button variant="ghost" onClick={() => setDueBoxOpen(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ITEMS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((p) => (
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

                  <Badge
                    variant={
                      p.stockStatus === "OUT_OF_STOCK"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {p.stockStatus}
                  </Badge>
                </div>

                <p>Price: ${p.price}</p>
                <p>Stock: {p.quantity}</p>

                <p className="font-bold text-primary">
                  ${p.totalPrice}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* MODAL */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <p>{selectedItem.name}</p>
                <p>Price: ${selectedItem.price}</p>

                <Input
                  type="number"
                  value={itemQty}
                  onChange={(e) => setItemQty(Number(e.target.value))}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedItem(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleAddItemToCustomer}
                    disabled={loading}
                  >
                    Add Item
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