import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { serverUrl } from "../../App";

/* ================= TYPES ================= */
interface Item {
  _id: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
}

interface Customer {
  _id: string;
  name: string;
  phone: string;
  totalAmount: number; // optional, can be undefined initially
  amountPaid: number;
  totalDue?: number;
  items: Item[];
  createdAt: string;
}

/* ================= CONFIG ================= */
const SHOP_NAME = "My Shop Pvt. Ltd.";
const SHOP_ADDRESS = "123 Main Street, Peshawar, Pakistan";

function ViewBill() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

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
    if (id) fetchCustomer();
  }, [id]);

  /* ================= GENERATE PROFESSIONAL INVOICE PDF ================= */
  const generateInvoice = () => {
    if (!customer || customer.items.length === 0) return;

    const doc = new jsPDF();

    // ---------------- Invoice Header ----------------
    doc.setFontSize(22);
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(12);
    doc.text(SHOP_NAME, 14, 28);
    doc.setFontSize(10);
    doc.text(SHOP_ADDRESS, 14, 34);

    // Customer Info
    doc.setFontSize(12);
    doc.text(`Invoice To: ${customer.name}`, 150, 28, { align: "right" });
    if (customer.phone)
      doc.text(`Phone: ${customer.phone}`, 150, 34, { align: "right" });

    // Invoice Metadata
    const invoiceNumber = `INV-${new Date().getTime()}`;
    doc.text(`Invoice #: ${invoiceNumber}`, 150, 40, { align: "right" });
    doc.text(
      `Date: ${new Date(customer.createdAt).toLocaleDateString()}`,
      150,
      46,
      { align: "right" }
    );

    // ---------------- Table ----------------
    const tableData = customer.items.map((item, index) => [
      index + 1,
      item.itemName,
      item.quantity,
      `Rs ${(item.price ?? 0).toFixed(2)}`,
      `Rs ${(item.total ?? 0).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["#", "Product", "Qty", "Price", "Total"]],
      body: tableData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [26, 152, 153], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 70 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 25, halign: "right" },
        4: { cellWidth: 25, halign: "right" },
      },
    });

    // ---------------- Totals ----------------
    const finalY = (doc as any).lastAutoTable.finalY || 60;

    const totalAmount = customer.totalAmount ?? customer.items.reduce((sum, i) => sum + (i.total ?? 0), 0);
    const amountPaid = customer.amountPaid ?? 0;
    const totalDue = customer.totalDue ?? totalAmount - amountPaid;

    doc.setFontSize(12);
    doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Amount Paid: Rs ${amountPaid.toFixed(2)}`, 14, finalY + 16);
    doc.text(`Total Due: Rs ${totalDue.toFixed(2)}`, 14, finalY + 22);

    // ---------------- Footer / Signature ----------------
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, finalY + 32);
    doc.text("Authorized Signature: ____________________", 14, finalY + 42);

    // ---------------- Save ----------------
    doc.save(`${customer.name}-invoice.pdf`);
  };

  return (
    <DashboardLayout>
      {!customer ? (
        <p className="text-gray-500">Loading bill...</p>
      ) : (
        <div className="space-y-6 flex flex-col items-center w-full">

          {/* ================= ACTION BAR ================= */}
          <div className="w-full flex justify-end">
            <button
              onClick={generateInvoice}
              className="px-4 py-2 rounded-lg border border-[#1A9899]
                         text-[#1A9899] hover:bg-[#1A9899]
                         hover:text-white transition"
            >
              ⬇️ Download Invoice
            </button>
          </div>

          {/* ================= INVOICE PREVIEW ================= */}
          <div className="bg-white p-6 rounded-xl border shadow-lg space-y-4 w-full max-w-3xl">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Invoice Preview</h2>
                <p className="text-sm text-gray-600">Customer: {customer.name}</p>
                <p className="text-sm text-gray-600">📞 {customer.phone}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-800">
                  Rs {(customer.totalAmount ?? 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="text-sm text-green-600 font-semibold">
                  Rs {(customer.amountPaid ?? 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Due</p>
                <p className="text-lg font-bold text-red-600">
                  Rs {(customer.totalAmount)-(customer.amountPaid)}
                </p>
              </div>
            </div>

            <table className="w-full text-sm border">
              <thead className="bg-[#1A9899] text-white">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.items.map((item, index) => (
                  <tr key={item._id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.itemName}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">Rs {(item.price ?? 0).toFixed(2)}</td>
                    <td className="p-2 text-right">Rs {(item.total ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ViewBill;