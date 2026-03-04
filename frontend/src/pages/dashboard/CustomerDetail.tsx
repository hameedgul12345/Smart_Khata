

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setItems } from "../../redux/slices/itemsSlice";
import { serverUrl } from "../../App";
import { Phone, Receipt } from "lucide-react";

/* ================= TYPES ================= */
interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  unit?: string;
  lowStockAlert?: number;
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

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [dueBoxOpen, setDueBoxOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemQty, setItemQty] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  /* ================= FETCH ITEMS (FIX REFRESH ISSUE) ================= */
  useEffect(() => {
    if (items.length === 0) {
      axios
        .get(`${serverUrl}/api/items/get-items`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data.items;

          dispatch(setItems(data));
        })
        .catch((err) => {
          console.error("Failed to fetch items", err);
        });
    }
  }, [items.length, dispatch]);

  /* ================= FETCH CUSTOMER ================= */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get<{ customer: Customer }>(
          `${serverUrl}/api/customers/${id}`,
          { withCredentials: true },
        );
        setCustomer(res.data.customer);
        console.log("customer", res.data.customer);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };

    fetchCustomer();
  }, [id]);

  /* ================= RECEIVE PAYMENT ================= */
  const receivePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0)
      return alert("Enter valid amount");

    if (customer && Number(paymentAmount) > customer.totalAmount)
      return alert("Amount exceeds due");

    try {
      await axios.put(
        `${serverUrl}/api/customers/update-due`,
        { customerId: id, amount: Number(paymentAmount) },
        { withCredentials: true },
      );

      setCustomer((prev) =>
        prev
          ? { ...prev, totalDue: prev.totalAmount - Number(paymentAmount) }
          : prev,
      );

      setPaymentAmount("");
      setDueBoxOpen(false);
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  /* ================= ADD ITEM TO CUSTOMER ================= */
  const handleAddItemToCustomer = async () => {
    if (!selectedItem || !id) return;

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/customers/add-items-to/${id}`,
        {
          itemId: selectedItem._id,
          quantity: itemQty,
        },
        { withCredentials: true },
      );

      // update total due locally
      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              totalDue: prev.totalAmount + selectedItem.price * itemQty,
            }
          : prev,
      );

      setSelectedItem(null);
      setItemQty(1);
    } catch (error) {
      console.error("Failed to add item to customer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* ================= CUSTOMER INFO ================= */}
        {customer && (
          <div className="flex items-center gap-4 p-5 mb-6 bg-[#E6F5F5] rounded-xl border border-[#1A9899]/30 shadow-sm">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-full bg-[#1A9899]/20 flex items-center justify-center 
                    text-[#1A9899] font-bold text-lg"
            >
              {customer.name?.charAt(0)}
            </div>

            {/* Customer Info */}
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">
                {customer.name}
              </p>
              <p className="text-sm text-gray-600">
                <Phone size={16} className="inline mr-1" />{" "}
                {customer.phone || "N/A"}
              </p>
            </div>

            {/* Total Due */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Due</p>
              <p
                className={`text-xl font-bold ${
                  customer.totalAmount > 0 ? "text-red-600" : "text-[#1A9899]"
                }`}
              >
                Rs {customer.totalAmount ?? 0}
              </p>
            </div>
          </div>
        )}

        {/* ================= PAYMENT BOX ================= */}
        {dueBoxOpen ? (
          <div className="bg-[#E6F5F5] border border-[#1A9899]/30 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
            {/* Amount Input */}
            <input
              type="number"
              placeholder="Received amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="border border-[#1A9899]/40 p-2 rounded-lg w-48
                 focus:outline-none focus:ring-2 focus:ring-[#1A9899]
                 placeholder-gray-400"
            />

            {/* Receive Button */}
            <button
              onClick={receivePayment}
              className="bg-[#1A9899] text-white px-6 py-2 rounded-lg
                 hover:bg-[#157f80] transition font-medium shadow-sm"
            >
              Receive
            </button>

            {/* Cancel */}
            <button
              onClick={() => setDueBoxOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="bg-[#E6F5F5] border border-[#1A9899]/30 rounded-xl p-4 mb-4 flex justify-end gap-3 items-center">
            {/* Take Payment */}
            <button
              onClick={() => setDueBoxOpen(true)}
              disabled={!customer || customer.totalAmount <= 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          customer && customer.totalAmount > 0
            ? "bg-[#1A9899] text-white hover:bg-[#157f80] shadow-sm"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
            >
              Take Payment
            </button>

            {/* View Bill */}
            <button
              onClick={() => navigate(`/dashboard/view-bill/${id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                 border border-[#1A9899] text-[#1A9899]
                 hover:bg-[#1A9899] hover:text-white transition"
            >
              <Receipt size={16} />
              View Bill
            </button>
          </div>
        )}

        {/* ================= ITEMS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              No items found
            </p>
          )}

          {items.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                if (p.stockStatus === "OUT_OF_STOCK") return;
                setSelectedItem(p);
                setItemQty(1);
              }}
              className={`cursor-pointer relative p-5 rounded-xl border shadow-sm transition hover:shadow-md ${
                p.stockStatus === "OUT_OF_STOCK"
                  ? "border-red-300 bg-red-50 cursor-not-allowed"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span
                className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold ${
                  p.stockStatus === "OUT_OF_STOCK"
                    ? "bg-red-500 text-white"
                    : "bg-[#1A9899] text-white"
                }`}
              >
                {p.stockStatus}
              </span>

              <h3 className="text-xl font-bold text-gray-800 mb-3">{p.name}</h3>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Price:</span> ${p.price}
                </p>
                <p>
                  <span className="font-semibold">Stock:</span> {p.quantity}{" "}
                  {p.unit || ""}
                </p>
                <p>
                  <span className="font-semibold">Total:</span>{" "}
                  <span className="text-[#1A9899] font-bold">
                    ${p.totalPrice}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= MODAL ================= */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Add Item to Customer
              </h3>

              <p className="mb-2 text-gray-600">
                <span className="font-semibold">Item:</span> {selectedItem.name}
              </p>

              <p className="mb-4 text-gray-600">
                <span className="font-semibold">Price:</span> $
                {selectedItem.price}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={selectedItem.quantity}
                  value={itemQty}
                  onChange={(e) => setItemQty(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1A9899]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={handleAddItemToCustomer}
                  className="bg-[#1A9899] disabled:opacity-50 text-white px-4 py-2 rounded-lg hover:bg-[#157f80]"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CustomerDetail;
