import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Khata = () => {
  const customers = ["Ali", "Ahmed"];
  const products = [
    { name: "Sugar", price: 120 },
    { name: "Milk", price: 180 }
  ];

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [entries, setEntries] = useState([]);

  const addEntry = () => {
    if (!selectedCustomer || !selectedProduct) return;

    const product = products.find(p => p.name === selectedProduct);

    setEntries([
      ...entries,
      {
        id: Date.now(),
        customer: selectedCustomer,
        product: product.name,
        price: product.price
      }
    ]);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Khata Entries</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">

        <select
          className="border p-2 rounded w-full"
          onChange={e => setSelectedCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded w-full"
          onChange={e => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.name}>{p.name}</option>
          ))}
        </select>

        <button
          onClick={addEntry}
          className="bg-teal-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id} className="border-t">
                <td className="p-3">{e.customer}</td>
                <td className="p-3">{e.product}</td>
                <td className="p-3">Rs {e.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Khata;
