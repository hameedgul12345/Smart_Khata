// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import { toast } from "sonner";
// import { serverUrl } from "../../App";
// import { Trash2 } from "lucide-react";

// /* ================= TYPES ================= */
// interface Item {
//   _id: string;
//   itemId: string;
//   itemName: string;
//   price: number;
//   quantity: number;
//   total: number;
// }

// interface Customer {
//   _id: string;
//   name: string;
//   phone: string;
//   totalAmount: number;
//   amountPaid: number;
//   items: Item[];
//   createdAt: string;
// }

// /* ================= COMPONENT ================= */
// function ViewBill() {
//   const { id } = useParams<{ id: string }>();
//   const [customer, setCustomer] = useState<Customer | null>(null);

//   /* FETCH */
//   const fetchCustomer = async () => {
//     try {
//       const res = await axios.get(`${serverUrl}/api/customers/${id}`, {
//         withCredentials: true,
//       });
//       setCustomer(res.data.customer);
//       console.log("customer",res.data.customer)
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (id) fetchCustomer();
//     console.log("customer",customer)
//   }, [id]);

//   /* ================= DELETE ITEM ================= */
//   const deleteItem = async (itemId: string) => {
//   try {
//     await axios.delete(`${serverUrl}/api/items/remove-item`, {
//       data: { customerId: id, itemId },
//       withCredentials: true,
//     });

//     setCustomer((prev) =>
//       prev
//         ? {
//             ...prev,
//             items: prev.items.filter((i) => i._id !== itemId),
//             totalAmount:
//               prev.totalAmount -
//               (prev.items.find((i) => i._id === itemId)?.total || 0),
//           }
//         : prev
//     );

//     toast.success("Item deleted successfully ✅");
//   } catch (error) {
//     console.error("Delete failed", error);
//     toast.error("Failed to delete item ❌");
//   }
// };

//   /* ================= CLEAR ALL ================= */
//   const clearAll = async () => {
//   if (!confirm("Clear all items?")) return;

//   try {
//     await axios.delete(`${serverUrl}/api/customers/clear-items/${id}`, {
//       withCredentials: true,
//     });

//     setCustomer((prev) =>
//       prev ? { ...prev, items: [], totalAmount: 0 } : prev
//     );

//     toast.success("All items cleared 🧹");
//   } catch (error) {
//     console.error("Clear failed", error);
//     toast.error("Failed to clear items ❌");
//   }
// };

//   /* ================= PDF ================= */
//  const generateInvoice = () => {
//   if (!customer || customer.items.length === 0) return;
//   fetchCustomer(); // to get latest data before generating
//   const doc = new jsPDF();

//   /* ================= HEADER ================= */
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.text(customer.name, 14, 15);

//   doc.setFontSize(10);
//   doc.setFont("helvetica", "normal");
//   doc.text("Sales Invoice", 160, 15);

//   doc.line(14, 18, 196, 18);

//   /* ================= CUSTOMER INFO ================= */
//   doc.setFontSize(11);
//   doc.text(`Customer: ${customer.name}`, 14, 25);
//   doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 25);
//   doc.text(`Type: CREDIT`, 160, 25);

//   /* ================= TABLE ================= */
//   const tableData = customer.items.map((item, i) => [
//     i + 1,
//     item.itemName,
//     item.quantity,
//     `Rs ${item.price}`,
//     `Rs ${item.total}`,
//   ]);

//   autoTable(doc, {
//     startY: 35,
//     head: [["#", "Product", "Qty", "Unit Price", "Total"]],
//     body: tableData,
//     theme: "grid",
//     headStyles: {
//       fillColor: [0, 0, 0],
//       textColor: 255,
//       fontStyle: "bold",
//     },
//     styles: {
//       fontSize: 10,
//       cellPadding: 3,
//     },
//   });

//   /* ================= CALCULATIONS ================= */
//   const finalY = (doc as any).lastAutoTable.finalY || 60;

//   const totalAmount = customer.items.reduce(
//     (sum, item) => sum + item.total,
//     0
//   );

//   const amountPaid = customer.amountPaid || 0;
//   // const remainingDue = totalAmount - amountPaid;

//   // /* ================= STATUS ================= */
//   // let status = "UNPAID";
//   // if (remainingDue === 0) status = "PAID";

//   // else if (amountPaid > 0) status = "PARTIAL";

//   doc.setFontSize(11);
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Status: ${status}`, 14, finalY + 10);

//   /* ================= TOTAL DETAILS ================= */
//   doc.text(`Total Amount: Rs ${totalAmount}`, 140, finalY + 10);
//   // doc.text(`Paid: Rs ${amountPaid}`, 140, finalY + 17);

//   doc.setTextColor(200, 0, 0); // red
//   // doc.text(`Remaining Due: Rs ${remainingDue}`, 140, finalY + 24);

//   /* ================= GRAND TOTAL BOX ================= */
//   doc.setFillColor(0, 0, 0);
//   doc.rect(140, finalY + 30, 60, 10, "F");

//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(12);
//   doc.text("GRAND TOTAL:", 142, finalY + 37);
//   doc.text(`Rs ${totalAmount}`, 180, finalY + 37, { align: "right" });

//   /* ================= FOOTER ================= */
//   doc.setTextColor(0, 0, 0);
//   doc.setFontSize(10);

//   doc.text("____________________", 20, finalY + 50);
//   doc.text("Customer Signature", 20, finalY + 55);

//   doc.text("____________________", 140, finalY + 50);
//   doc.text("Authorized Signature", 140, finalY + 55);

//   /* ================= SAVE ================= */
//   doc.save(`${customer.name}-invoice.pdf`);
// };

//   if (!customer) return <DashboardLayout>Loading...</DashboardLayout>;

//   const total = customer.totalAmount;
  

//   return (
//     <DashboardLayout>
//       <div className="p-6 space-y-6">

//         {/* ACTION BAR */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={generateInvoice}
//             className="border px-4 py-2 rounded hover:bg-teal-600 hover:text-white"
//           >
//             Download
//           </button>

//           {/* CLEAR ALL */}
//           <button
//             onClick={clearAll}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Clear All
//           </button>
//         </div>

//         {/* INVOICE */}
//         <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">

//           {/* HEADER */}
//           <div className="flex justify-between mb-4">
//             <div>
//               <h2 className="text-xl font-bold">{customer.name}</h2>
//               <p className="text-sm">{customer.phone}</p>
//             </div>

//             <div className="text-right">
//               {/* <p>Due: Rs {total}</p> */}
//               {/* <p className="text-green-600">Paid: Rs {paid}</p> */}
//               {/* <p className="text-red-600 font-bold">Due: Rs {total}</p> */}
//             </div>
//           </div>

//           {/* TABLE */}
//           <table className="w-full border text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>Qty</th>
//                 <th>Price</th>
//                 <th>Total</th>
//                 <th></th>
//               </tr>
//             </thead>

//             <tbody>
//               {customer.items.map((item, index) => (
//                 <tr key={item._id} className="border-b">
//                   <td className="p-2">{index + 1}</td>
//                   <td>{item.itemName}</td>
//                   <td>{item.quantity}</td>
//                   <td>Rs {item.price}</td>
//                   <td>Rs {item.total}</td>

//                   {/* DELETE BUTTON */}
//                   <td>
//                     <button
//                       onClick={() => deleteItem(item._id)}
//                       className="p-2 hover:bg-red-100 rounded"
//                     >
//                       <Trash2 className="w-4 h-4 text-red-500" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default ViewBill;



import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { toast } from "sonner";
import { serverUrl } from "../../App";
import {
  Trash2,
  Download,
  Receipt,
  Phone,
  CalendarDays,
} from "lucide-react";

/* ================= TYPES ================= */

interface Item {
  _id: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  total: number;
}

interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalAmount: number;
  amountPaid: number;
  items: Item[];
  createdAt: string;
}

/* ================= COMPONENT ================= */

function ViewBill() {
  const { id } = useParams<{ id: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);

  /* ================= FETCH ================= */

  const fetchCustomer = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/customers/${id}`,
        {
          withCredentials: true,
        }
      );

      setCustomer(res.data.customer);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bill");
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id]);

  /* ================= DELETE ITEM ================= */

  const deleteItem = async (itemId: string) => {
    try {
      await axios.delete(
        `${serverUrl}/api/items/remove-item`,
        {
          data: {
            customerId: id,
            itemId,
          },
          withCredentials: true,
        }
      );

      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter(
                (i) => i._id !== itemId
              ),
              totalAmount:
                prev.totalAmount -
                (prev.items.find(
                  (i) => i._id === itemId
                )?.total || 0),
            }
          : prev
      );

      toast.success("Item deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  /* ================= CLEAR ALL ================= */

  const clearAll = async () => {
    if (!confirm("Clear all items?")) return;

    try {
      await axios.delete(
        `${serverUrl}/api/customers/clear-items/${id}`,
        {
          withCredentials: true,
        }
      );

      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              items: [],
              totalAmount: 0,
            }
          : prev
      );

      toast.success("All items cleared");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear items");
    }
  };

  /* ================= PDF ================= */

  // const generateInvoice = () => {
  //   if (!customer || customer.items.length === 0)
  //     return;

  //   const doc = new jsPDF();

  //   const totalAmount = customer.items.reduce(
  //     (sum, item) => sum + item.total,
  //     0
  //   );

  //   /* HEADER */

  //   doc.setFontSize(22);
  //   doc.setTextColor(0, 0, 0);
  //   doc.text("SaleTrack Invoice", 14, 20);

  //   doc.setFontSize(11);
  //   doc.text(
  //     `Customer: ${customer.name}`,
  //     14,
  //     32
  //   );

  //   doc.text(
  //     `Phone: ${customer.phone}`,
  //     14,
  //     40
  //   );

  //   doc.text(
  //     `Date: ${new Date().toLocaleDateString()}`,
  //     140,
  //     32
  //   );

  //   doc.text(
  //     `Items: ${customer.items.length}`,
  //     140,
  //     40
  //   );

  //   /* TABLE */

  //   autoTable(doc, {
  //     startY: 50,
  //     head: [
  //       [
  //         "#",
  //         "Item",
  //         "Qty",
  //         "Price",
  //         "Total",
  //       ],
  //     ],
  //     body: customer.items.map((item, i) => [
  //       i + 1,
  //       item.itemName,
  //       item.quantity,
  //       `Rs ${item.price}`,
  //       `Rs ${item.total}`,
  //     ]),
  //     theme: "grid",
  //     headStyles: {
  //       fillColor: [15, 23, 42],
  //       textColor: 255,
  //     },
  //     styles: {
  //       fontSize: 10,
  //     },
  //   });

  //   const finalY =
  //     (doc as any).lastAutoTable.finalY || 70;

  //   /* TOTAL */

  //   doc.setFontSize(14);
  //   doc.text(
  //     `Grand Total: Rs ${totalAmount}`,
  //     135,
  //     finalY + 20
  //   );

  //   /* FOOTER */

  //   doc.setFontSize(10);
  //   doc.text(
  //     "Thank you for your business!",
  //     14,
  //     finalY + 40
  //   );

  //   doc.save(`${customer.name}-invoice.pdf`);
  // };

  
/* ================= PDF ================= */
const generateInvoice = () => {
  if (!customer || customer.items.length === 0) return;

  fetchCustomer(); // to get latest data before generating
  const doc = new jsPDF();

  /* ================= HEADER ================= */
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(customer.name, 14, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sales Invoice", 160, 15);

  doc.line(14, 18, 196, 18);

  /* ================= CUSTOMER INFO ================= */
  doc.setFontSize(11);
  doc.text(`Customer: ${customer.name}`, 14, 25);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 25);
  doc.text(`Type: CREDIT`, 160, 25);

  /* ================= TABLE ================= */
  const tableData = customer.items.map((item, i) => [
    i + 1,
    item.itemName,
    item.quantity,
    `Rs ${item.price}`,
    `Rs ${item.total}`,
  ]);

  autoTable(doc, {
    startY: 35,
    head: [["#", "Product", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  /* ================= CALCULATIONS ================= */
  const finalY = ((doc as any).lastAutoTable?.finalY ?? 60) as number;

  const totalAmount = customer.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const amountPaid = customer.amountPaid || 0;
  const remainingDue = totalAmount - amountPaid;

  /* ================= STATUS ================= */
  let status = "UNPAID";

  if (remainingDue === 0) status = "PAID";
  else if (amountPaid > 0) status = "PARTIAL";

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Status: ${status}`, 14, finalY + 10);

  /* ================= TOTAL DETAILS ================= */
  doc.text(`Total Amount: Rs ${totalAmount}`, 140, finalY + 10);
  doc.text(`Paid: Rs ${amountPaid}`, 140, finalY + 17);

  doc.setTextColor(200, 0, 0);
  doc.text(`Remaining Due: Rs ${remainingDue}`, 140, finalY + 24);

  /* ================= GRAND TOTAL BOX ================= */
  doc.setFillColor(0, 0, 0);
  doc.rect(140, finalY + 30, 60, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("GRAND TOTAL:", 142, finalY + 37);
  doc.text(`Rs ${totalAmount}`, 180, finalY + 37, {
    align: "right",
  });

  /* ================= FOOTER ================= */
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  doc.text("____________________", 20, finalY + 50);
  doc.text("Customer Signature", 20, finalY + 55);

  doc.text("____________________", 140, finalY + 50);
  doc.text("Authorized Signature", 140, finalY + 55);

  /* ================= SAVE ================= */
  doc.save(`${customer.name}-invoice.pdf`);
};
  /* ================= LOADING ================= */

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#050816] p-6">

        {/* TOP ACTIONS */}

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Customer Invoice
            </h1>

            <p className="text-slate-400 mt-1">
              Detailed billing information
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={generateInvoice}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition text-white font-medium shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* INVOICE CARD */}

        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#0b1220]/80 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between gap-6">

            <div className="flex gap-4">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
                {customer.name.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {customer.name}
                </h2>

                <div className="mt-2 space-y-1">

                  <p className="flex items-center gap-2 text-slate-400 text-sm">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </p>

                  <p className="flex items-center gap-2 text-slate-400 text-sm">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(
                      customer.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-slate-400 text-sm">
                Total Due
              </p>

              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Rs {customer.totalAmount}
              </h2>

              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
                <Receipt className="w-3 h-3" />
                Invoice Generated
              </div>
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-white/5 border-b border-white/10">

                <tr className="text-slate-300 text-sm">

                  <th className="text-left px-6 py-4">
                    #
                  </th>

                  <th className="text-left px-6 py-4">
                    Item
                  </th>

                  <th className="text-center px-6 py-4">
                    Qty
                  </th>

                  <th className="text-center px-6 py-4">
                    Price
                  </th>

                  <th className="text-center px-6 py-4">
                    Total
                  </th>

                  <th className="text-right px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {customer.items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-20 text-slate-500"
                    >
                      No items available
                    </td>
                  </tr>
                ) : (
                  customer.items.map((item, index) => (
                    <tr
                      key={item._id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition"
                    >

                      <td className="px-6 py-4 text-slate-400">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {item.itemName}
                          </p>

                          <p className="text-xs text-slate-500">
                            Product Item
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center text-slate-300">
                        {item.quantity}
                      </td>

                      <td className="px-6 py-4 text-center text-slate-300">
                        Rs {item.price}
                      </td>

                      <td className="px-6 py-4 text-center font-semibold">

                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                          Rs {item.total}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end">

                          <button
                            onClick={() =>
                              deleteItem(item._id)
                            }
                            className="p-2 rounded-lg hover:bg-red-500/10 transition group"
                          >
                            <Trash2 className="w-4 h-4 text-red-400 group-hover:scale-110 transition" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* FOOTER */}

          {customer.items.length > 0 && (
            <div className="border-t border-white/10 p-6 flex justify-end">

              <div className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-5">

                <div className="flex justify-between text-slate-400 mb-3">
                  <span>Total Items</span>
                  <span>
                    {customer.items.length}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-semibold">

                  <span className="text-white">
                    Grand Total
                  </span>

                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text text-2xl font-bold">
                    Rs {customer.totalAmount}
                  </span>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewBill;