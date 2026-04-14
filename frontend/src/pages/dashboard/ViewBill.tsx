import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../components/layout/DashboardLayout";

import { serverUrl } from "../../App";
import { Trash2 } from "lucide-react";

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

  /* FETCH */
  const fetchCustomer = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/customers/${id}`, {
        withCredentials: true,
      });
      setCustomer(res.data.customer);
      console.log("customer",res.data.customer)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchCustomer();
    console.log("customer",customer)
  }, [id]);

  /* ================= DELETE ITEM ================= */
  const deleteItem = async (itemId: string) => {
    // if (!confirm("Delete this item?")) return;

    try {
      await axios.delete(`${serverUrl}/api/items/remove-item`, {
        data: { customerId: id, itemId },
        withCredentials: true,
      });

      // update UI
      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((i) => i._id !== itemId),
              totalAmount:
                prev.totalAmount -
                (prev.items.find((i) => i._id === itemId)?.total || 0),
            }
          : prev
      );
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ================= CLEAR ALL ================= */
  const clearAll = async () => {
    if (!confirm("Clear all items?")) return;

    try {
      await axios.delete(`${serverUrl}/api/customers/clear-items/${id}`, {
        withCredentials: true,
      });

      setCustomer((prev) =>
        prev ? { ...prev, items: [], totalAmount: 0 } : prev
      );
    } catch (error) {
      console.error("Clear failed", error);
    }
  };

  /* ================= PDF ================= */
 const generateInvoice = () => {
  if (!customer || customer.items.length === 0) return;
  fetchCustomer(); // to get latest data before generating
  const doc = new jsPDF();

  /* ================= HEADER ================= */
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("786 Tractor Spare Parts", 14, 15);

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
  const finalY = (doc as any).lastAutoTable.finalY || 60;

  const totalAmount = customer.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const amountPaid = customer.amountPaid || 0;
  // const remainingDue = totalAmount - amountPaid;

  // /* ================= STATUS ================= */
  // let status = "UNPAID";
  // if (remainingDue === 0) status = "PAID";

  // else if (amountPaid > 0) status = "PARTIAL";

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Status: ${status}`, 14, finalY + 10);

  /* ================= TOTAL DETAILS ================= */
  doc.text(`Total Amount: Rs ${totalAmount}`, 140, finalY + 10);
  // doc.text(`Paid: Rs ${amountPaid}`, 140, finalY + 17);

  doc.setTextColor(200, 0, 0); // red
  // doc.text(`Remaining Due: Rs ${remainingDue}`, 140, finalY + 24);

  /* ================= GRAND TOTAL BOX ================= */
  doc.setFillColor(0, 0, 0);
  doc.rect(140, finalY + 30, 60, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("GRAND TOTAL:", 142, finalY + 37);
  doc.text(`Rs ${totalAmount}`, 180, finalY + 37, { align: "right" });

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

  if (!customer) return <DashboardLayout>Loading...</DashboardLayout>;

  const total = customer.totalAmount;
  

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* ACTION BAR */}
        <div className="flex justify-end gap-3">
          <button
            onClick={generateInvoice}
            className="border px-4 py-2 rounded hover:bg-teal-600 hover:text-white"
          >
            Download
          </button>

          {/* CLEAR ALL */}
          <button
            onClick={clearAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All
          </button>
        </div>

        {/* INVOICE */}
        <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">{customer.name}</h2>
              <p className="text-sm">{customer.phone}</p>
            </div>

            <div className="text-right">
              {/* <p>Due: Rs {total}</p> */}
              {/* <p className="text-green-600">Paid: Rs {paid}</p> */}
              {/* <p className="text-red-600 font-bold">Due: Rs {total}</p> */}
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {customer.items.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>Rs {item.price}</td>
                  <td>Rs {item.total}</td>

                  {/* DELETE BUTTON */}
                  <td>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="p-2 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewBill;
