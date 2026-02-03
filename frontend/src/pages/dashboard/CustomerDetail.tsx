import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";

function CustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [dueBoxOpen, setDueBoxOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  /* ================= FETCH CUSTOMER ================= */
  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await axios.get(`${serverUrl}/api/customers/${id}`, {
        withCredentials: true,
      });
      setCustomer(res.data.customer);
    };
    fetchCustomer();
  }, [id]);

  /* ================= FETCH LEDGER ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`${serverUrl}/api/products/product/${id}`, {
        withCredentials: true,
      });
      setLedger(res.data.products || []);
      console.log("total legder", ledger);
    };
    fetchProducts();
  }, [id]);

  /* ================= ADD PRODUCT ================= */
  const addEntry = async () => {
    if (!productName || !price) return alert("Enter product & price");

    const res = await axios.post(
      `${serverUrl}/api/products/add-product`,
      { customerId: id, productName, price: Number(price) },
      { withCredentials: true },
    );

    setLedger((prev) => [...prev, res.data.product]);
    setCustomer((prev) => ({
      ...prev,
      totalDue: prev.totalDue + Number(price),
    }));

    setProductName("");
    setPrice("");
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteEntry = async (entryId , entryPrice) => {
    await axios.delete(`${serverUrl}/api/products/delete-product`, {
      data: { productId: entryId, customerId: id, price: entryPrice },
      withCredentials: true,
    });

    setLedger((prev) => prev.filter((e) => e._id !== entryId));
    setCustomer((prev) => ({
      ...prev,
      totalDue: prev.totalDue - entryPrice,
    }));
  };

  /* ================= RECEIVE PAYMENT ================= */
  const receivePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0)
      return alert("Enter valid amount");
    if (paymentAmount > customer.totalDue) return alert("Amount exceeds due");

    try {
      const { data } = await axios.put(
        `${serverUrl}/api/customers/update-due`,
        { customerId: id, amount: Number(paymentAmount) },
        { withCredentials: true },
      );
      // alert(data)
      setCustomer((prev) => ({
        ...prev,
        totalDue: prev.totalDue - Number(paymentAmount),
      }));

      setPaymentAmount("");
      setDueBoxOpen(false);

      // alert(data.message); // Optional success message
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Payment failed");
    }
  };
  const clearAll = async () => {
    try {
      await axios.delete(`${serverUrl}/api/products/clear-products`, {
        data: { customerId: id },
        withCredentials: true,
      });

      // UI update only
      setLedger([]);
      setCustomer((prev) => ({
        ...prev,
        totalDue: 0,
      }));
    } catch (error) {
      console.log("Error while clearing all products", error);
    }
  };

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
          {/* Total Due Badge */}
          <div
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow-sm
      ${
        customer.totalDue > 0
          ? "bg-red-50 text-red-600 border border-red-200"
          : "bg-green-50 text-green-600 border border-green-200"
      }`}
          >
            Total Due: <span className="font-bold">Rs {customer.totalDue}</span>
          </div>

          {/* Download Button */}
          {ledger.length !== 0 && (
            <button
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium
                 bg-blue-600 text-white rounded-lg shadow
                 hover:bg-blue-700 active:scale-95 transition-all"
            >
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
        <button
          onClick={addEntry}
          className="bg-teal-600 text-white px-6 rounded"
        >
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
          <button
            onClick={receivePayment}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Receive
          </button>
          <button
            onClick={() => setDueBoxOpen(false)}
            className="text-sm text-gray-500"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ================= LEDGER ================= */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {ledger.length === 0 ? (
          <>
            <div className="p-10 text-center text-gray-400">
              No ledger entries
            </div>

            {/* ================= TOTAL DUE FOOTER ================= */}
            <div className="border-t p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Total Due</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">Rs {customer.totalDue}</p>
                <button
                  onClick={() => setDueBoxOpen(true)}
                  disabled={customer.totalDue <= 0}
                  className={`mt-2 px-4 py-2 rounded text-sm
                    ${
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
            {/* ===== Ledger Header Actions ===== */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50">
              <h3 className="text-lg font-semibold text-gray-700">
                Products Ledger
              </h3>

              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium
               text-red-600 border border-red-200 rounded-lg
               hover:bg-red-50 hover:border-red-300
               active:scale-95 transition-all"
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
                    <td className="p-4 text-sm">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">{entry.name}</td>
                    <td className="p-4 text-center font-semibold text-red-600">
                      Rs {entry.price}
                    </td>
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

            {/* ================= TOTAL DUE FOOTER ================= */}
            <div className="border-t p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Total Due</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">Rs {customer.totalDue}</p>
                <button
                  onClick={() => setDueBoxOpen(true)}
                  disabled={customer.totalDue <= 0}
                  className={`mt-2 px-4 py-2 rounded text-sm
                    ${
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

