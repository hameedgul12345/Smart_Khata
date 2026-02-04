import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";

/* ================= TYPES ================= */
interface LedgerEntry {
  _id: string;
  name: string;
  price: number;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalDue: number;
}

function CustomerDetail() {
  const { id } = useParams<{ id: string }>();

  /* ================= STATES ================= */
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [dueBoxOpen, setDueBoxOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  /* ================= FETCH CUSTOMER ================= */
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get<{ customer: Customer }>(
          `${serverUrl}/api/customers/${id}`,
          { withCredentials: true }
        );
        setCustomer(res.data.customer);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };
    fetchCustomer();
  }, [id]);

  /* ================= FETCH LEDGER ================= */
  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await axios.get<{ products: LedgerEntry[] }>(
          `${serverUrl}/api/products/product/${id}`,
          { withCredentials: true }
        );
        setLedger(res.data.products || []);
      } catch (error) {
        console.error("Failed to fetch ledger:", error);
      }
    };
    fetchLedger();
  }, [id]);

  /* ================= ADD PRODUCT ================= */
  const addEntry = async () => {
    if (!productName || !price) return alert("Enter product & price");

    try {
      const res = await axios.post<{ product: LedgerEntry }>(
        `${serverUrl}/api/products/add-product`,
        { customerId: id, productName, price: Number(price) },
        { withCredentials: true }
      );

      setLedger((prev) => [...prev, res.data.product]);

      setCustomer((prev) =>
        prev ? { ...prev, totalDue: prev.totalDue + Number(price) } : prev
      );

      setProductName("");
      setPrice("");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteEntry = async (entryId: string, entryPrice: number) => {
    try {
      await axios.delete(`${serverUrl}/api/products/delete-product`, {
        data: { productId: entryId, customerId: id, price: entryPrice },
        withCredentials: true,
      });

      setLedger((prev) => prev.filter((e) => e._id !== entryId));
      setCustomer((prev) =>
        prev ? { ...prev, totalDue: prev.totalDue - entryPrice } : prev
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  /* ================= RECEIVE PAYMENT ================= */
  const receivePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0)
      return alert("Enter valid amount");
    if (customer && Number(paymentAmount) > customer.totalDue)
      return alert("Amount exceeds due");

    try {
      await axios.put(
        `${serverUrl}/api/customers/update-due`,
        { customerId: id, amount: Number(paymentAmount) },
        { withCredentials: true }
      );

      setCustomer((prev) =>
        prev ? { ...prev, totalDue: prev.totalDue - Number(paymentAmount) } : prev
      );

      setPaymentAmount("");
      setDueBoxOpen(false);
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  /* ================= CLEAR ALL PRODUCTS ================= */
  const clearAll = async () => {
    try {
      await axios.delete(`${serverUrl}/api/products/clear-products`, {
        data: { customerId: id },
        withCredentials: true,
      });

      setLedger([]);
      setCustomer((prev) => (prev ? { ...prev, totalDue: 0 } : prev));
    } catch (error) {
      console.error("Failed to clear products:", error);
    }
  };

  /* ================= LOADING STATE ================= */
  if (!customer) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-500">Loading customer...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* ================= CUSTOMER INFO ================= */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{customer.name}</h2>
          <p className="text-gray-500">{customer.phone}</p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow-sm ${
              customer.totalDue > 0
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            Total Due: <span className="font-bold">Rs {customer.totalDue}</span>
          </div>

          {ledger.length > 0 && (
            <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all">
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* ================= ADD PRODUCT ================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-40"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addEntry} className="bg-teal-600 text-white px-6 rounded">
          Add
        </button>
      </div>

      {/* ================= PAYMENT BOX ================= */}
      {dueBoxOpen && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex gap-3 items-center">
          <input
            type="number"
            placeholder="Received amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="border p-2 rounded w-48"
          />
          <button onClick={receivePayment} className="bg-blue-600 text-white px-6 py-2 rounded">
            Receive
          </button>
          <button onClick={() => setDueBoxOpen(false)} className="text-sm text-gray-500">
            Cancel
          </button>
        </div>
      )}

      {/* ================= LEDGER ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {ledger.length === 0 ? (
          <>
            <div className="p-10 text-center text-gray-400">No ledger entries</div>

            <div className="border-t p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Total Due</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">Rs {customer.totalDue}</p>
                <button
                  onClick={() => setDueBoxOpen(true)}
                  disabled={customer.totalDue <= 0}
                  className={`mt-2 px-4 py-2 rounded text-sm ${
                    customer.totalDue > 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  Take Payment
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50">
              <h3 className="text-lg font-semibold text-gray-700">Products Ledger</h3>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all"
              >
                🧹 Clear All Products
              </button>
            </div>

            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry._id} className="border-t">
                    <td className="p-4 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{entry.name}</td>
                    <td className="p-4 text-center font-semibold text-red-600">Rs {entry.price}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => deleteEntry(entry._id, entry.price)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Total Due</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">Rs {customer.totalDue}</p>
                <button
                  onClick={() => setDueBoxOpen(true)}
                  disabled={customer.totalDue <= 0}
                  className={`mt-2 px-4 py-2 rounded text-sm ${
                    customer.totalDue > 0
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  Take Payment
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CustomerDetail;
