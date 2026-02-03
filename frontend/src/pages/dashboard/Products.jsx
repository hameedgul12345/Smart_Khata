import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Sugar", price: 120 },
    { id: 2, name: "Milk", price: 180 }
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = () => {
    if (!name || !price) return;

    setProducts([...products, { id: Date.now(), name, price }]);
    setName("");
    setPrice("");
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <button
          onClick={addProduct}
          className="bg-teal-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">Rs {p.price}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Products;
