// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import axios from "axios";
// import { serverUrl } from "../../App";
// import { jsPDF } from "jspdf";
// import { autoTable } from "jspdf-autotable";
// import { useAppSelector } from "../../redux/hooks";

// import type { Customer } from "../../redux/slices/customersSlices";

// /* ================= TYPES ================= */
// interface LedgerEntry {
//   _id: string;
//   name: string;
//   price: number;
//   createdAt: string;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone?: string;
//   totalDue: number;
// }

// function CustomerDetail() {
//   const { id } = useParams<{ id: string }>();
//   const items=useAppSelector((state) => state.items.items); // Access items from Redux
//   console.log("items all",items)
//   /* ================= STATES ================= */
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [ledger, setLedger] = useState<LedgerEntry[]>([]);
//   const [productName, setProductName] = useState("");
//   const [price, setPrice] = useState<string>("");
//   const [dueBoxOpen, setDueBoxOpen] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState<string>("");

//   /* ================= FETCH CUSTOMER ================= */
//   useEffect(() => {
//     const fetchCustomer = async () => {
//       try {
//         const res = await axios.get<{ customer: Customer }>(
//           `${serverUrl}/api/customers/${id}`,
//           { withCredentials: true },
//         );
//         setCustomer(res.data.customer);
//       } catch (error) {
//         console.error("Failed to fetch customer:", error);
//       }
//     };
//     fetchCustomer();
//   }, [id]);

//   /* ================= FETCH LEDGER ================= */
//   useEffect(() => {
//     const fetchLedger = async () => {
//       try {
//         const res = await axios.get<{ products: LedgerEntry[] }>(
//           `${serverUrl}/api/products/product/${id}`,
//           { withCredentials: true },
//         );
//         setLedger(res.data.products || []);
//       } catch (error) {
//         console.error("Failed to fetch ledger:", error);
//       }
//     };
//     fetchLedger();
//   }, [id]);

//   /* ================= ADD PRODUCT ================= */
//   const addEntry = async () => {
//     if (!productName || !price) return alert("Enter product & price");

//     try {
//       const res = await axios.post<{ product: LedgerEntry }>(
//         `${serverUrl}/api/products/add-product`,
//         { customerId: id, productName, price: Number(price) },
//         { withCredentials: true },
//       );

//       setLedger((prev) => [...prev, res.data.product]);

//       setCustomer((prev) =>
//         prev ? { ...prev, totalDue: prev.totalDue + Number(price) } : prev,
//       );

//       setProductName("");
//       setPrice("");
//     } catch (error) {
//       console.error("Failed to add product:", error);
//       alert("Failed to add product");
//     }
//   };

//   /* ================= DELETE PRODUCT ================= */
//   const deleteEntry = async (entryId: string, entryPrice: number) => {
//     try {
//       await axios.delete(`${serverUrl}/api/products/delete-product`, {
//         data: { productId: entryId, customerId: id, price: entryPrice },
//         withCredentials: true,
//       });

//       setLedger((prev) => prev.filter((e) => e._id !== entryId));
//       setCustomer((prev) =>
//         prev ? { ...prev, totalDue: prev.totalDue - entryPrice } : prev,
//       );
//     } catch (error) {
//       console.error("Failed to delete product:", error);
//       alert("Failed to delete product");
//     }
//   };

//   /* ================= RECEIVE PAYMENT ================= */
//   const receivePayment = async () => {
//     if (!paymentAmount || Number(paymentAmount) <= 0)
//       return alert("Enter valid amount");
//     if (customer && Number(paymentAmount) > customer.totalDue)
//       return alert("Amount exceeds due");

//     try {
//       await axios.put(
//         `${serverUrl}/api/customers/update-due`,
//         { customerId: id, amount: Number(paymentAmount) },
//         { withCredentials: true },
//       );

//       setCustomer((prev) =>
//         prev
//           ? { ...prev, totalDue: prev.totalDue - Number(paymentAmount) }
//           : prev,
//       );

//       setPaymentAmount("");
//       setDueBoxOpen(false);
//     } catch (error: any) {
//       console.error("Payment error:", error);
//       alert(error.response?.data?.message || "Payment failed");
//     }
//   };

//   /* ================= CLEAR ALL PRODUCTS ================= */
//   const clearAll = async () => {
//     try {
//       await axios.delete(`${serverUrl}/api/products/clear-products`, {
//         data: { customerId: id },
//         withCredentials: true,
//       });

//       setLedger([]);
//       setCustomer((prev) => (prev ? { ...prev, totalDue: 0 } : prev));
//     } catch (error) {
//       console.error("Failed to clear products:", error);
//     }
//   };

//   /* ================= LOADING STATE ================= */
//   if (!customer) {
//     return (
//       <DashboardLayout>
//         <p className="text-center text-gray-500">Loading customer...</p>
//       </DashboardLayout>
//     );
//   }

//   const generateInvoice = () => {
//     if (!customer || ledger.length === 0) return;
//     // alert("hello")

//     const doc = new jsPDF();

//     // ---------------- Header ----------------
//     doc.setFontSize(18);
//     doc.text("INVOICE", 14, 20);

//     doc.setFontSize(11);
//     doc.text(`Customer Name: ${customer.name}`, 14, 30);
//     if (customer.phone) {
//       doc.text(`Phone: ${customer.phone}`, 14, 36);
//     }

//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);

//     // ---------------- Table ----------------
//     const tableData = ledger.map((item, index) => [
//       index + 1,
//       new Date(item.createdAt).toLocaleDateString(),
//       item.name,
//       `Rs ${item.price}`,
//     ]);

//     autoTable(doc, {
//       startY: 45,
//       head: [["#", "Date", "Product", "Price"]],
//       body: tableData,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [22, 160, 133] }, // teal
//       columnStyles: {
//         0: { cellWidth: 10 },
//         1: { cellWidth: 30 },
//         2: { cellWidth: 90 },
//         3: { cellWidth: 30, halign: "right" },
//       },
//     });

//     // ---------------- Total ----------------
//     const finalY = (doc as any).lastAutoTable.finalY || 60;
//     doc.setFontSize(12);
//     doc.text(`Total Due: Rs ${customer.totalDue}`, 14, finalY + 10);

//     // ---------------- Footer ----------------
//     doc.setFontSize(10);
//     doc.text("Thank you for your business", 14, finalY + 20);

//     // ---------------- Save ----------------
//     doc.save(`${customer.name}-invoice.pdf`);
//   };

//   return (
//     <DashboardLayout>
//       {/* ================= CUSTOMER INFO ================= */}
//       <div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold">{customer.name}</h2>
//           <p className="text-gray-500">{customer.phone}</p>
//         </div>

//         <div className="flex flex-col items-center gap-5">
//           {/* <div
//             className={`px-6 py-2 rounded-full text-sm font-semibold shadow-sm ${
//               customer.totalDue > 0
//                 ? "bg-red-50 text-red-600 border border-red-200"
//                 : "bg-green-50 text-green-600 border border-green-200"
//             }`}
//           >
//             Total Due: <span className="font-bold">Rs {customer.totalDue}</span>
//           </div> */}

//           {ledger.length > 0 && (
//             <button
//               onClick={generateInvoice}
//               className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all"
//             >
//               📄 Download Invoice
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ================= ADD PRODUCT ================= */}
//       <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">
//         <input
//           className="border p-2 rounded w-full"
//           placeholder="Product name"
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//         />
//         <input
//           className="border p-2 rounded w-40"
//           type="number"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//         />
//         <button
//           onClick={addEntry}
//           className="bg-teal-600 text-white px-6 rounded"
//         >
//           Add
//         </button>
//       </div>

//       {/* ================= PAYMENT BOX ================= */}
//       {dueBoxOpen ? (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex gap-3 items-center">
//           <input
//             type="number"
//             placeholder="Received amount"
//             value={paymentAmount}
//             onChange={(e) => setPaymentAmount(e.target.value)}
//             className="border p-2 rounded w-48"
//           />
//           <button
//             onClick={receivePayment}
//             className="bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             Receive
//           </button>
//           <button
//             onClick={() => setDueBoxOpen(false)}
//             className="text-sm text-gray-500"
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex justify-end gap-3 items-center">
//         <button
//           onClick={() => setDueBoxOpen(true)}
//           disabled={customer.totalDue <= 0}
//           className={`mt-2 px-4 py-2 rounded text-sm ${
//             customer.totalDue > 0
//               ? "bg-blue-600 text-white"
//               : "bg-gray-300 text-gray-500"
//           }`}
//         >
//           Take Payment
//         </button>
//         </div>
//       )}

//       {/* ================= LEDGER ================= */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         {ledger.length === 0 ? (
//           <>
//             <div className="p-10 text-center text-gray-400">
//               No ledger entries
//             </div>

//             <div className="border-t p-4 flex justify-between items-center">
//               <h3 className="font-semibold text-lg">Total Due</h3>
//               <div className="text-right">
//                 <p className="text-2xl font-bold">Rs {customer.totalDue}</p>
//               </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50">
//               <h3 className="text-lg font-semibold text-gray-700">
//                 Products Ledger
//               </h3>
//               <button
//                 onClick={clearAll}
//                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all"
//               >
//                 🧹 Clear All Products
//               </button>
//             </div>

//             <table className="w-full">
//               <thead className="bg-slate-100">
//                 <tr>
//                   <th className="p-4 text-left">Date</th>
//                   <th className="p-4 text-left">Product</th>
//                   <th className="p-4 text-center">Price</th>
//                   <th className="p-4 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ledger.map((entry) => (
//                   <tr key={entry._id} className="border-t">
//                     <td className="p-4 text-sm">
//                       {new Date(entry.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-4">{entry.name}</td>
//                     <td className="p-4 text-center font-semibold text-red-600">
//                       Rs {entry.price}
//                     </td>
//                     <td className="p-4 text-center">
//                       <button
//                         onClick={() => deleteEntry(entry._id, entry.price)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="border-t p-4 flex justify-between items-center">
//               <h3 className="font-semibold text-lg">Total Due</h3>
//               <div className="text-right">
//                 <p className="text-2xl font-bold">Rs {customer.totalDue}</p>

//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// export default CustomerDetail;

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
  totalDue: number;
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

    if (customer && Number(paymentAmount) > customer.totalDue)
      return alert("Amount exceeds due");

    try {
      await axios.put(
        `${serverUrl}/api/customers/update-due`,
        { customerId: id, amount: Number(paymentAmount) },
        { withCredentials: true },
      );

      setCustomer((prev) =>
        prev
          ? { ...prev, totalDue: prev.totalDue - Number(paymentAmount) }
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
              totalDue: prev.totalDue + selectedItem.price * itemQty,
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
                  customer.totalDue > 0 ? "text-red-600" : "text-[#1A9899]"
                }`}
              >
                Rs {customer.totalDue ?? 0}
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
              disabled={!customer || customer.totalDue <= 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
        ${
          customer && customer.totalDue > 0
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
