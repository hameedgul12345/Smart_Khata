

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCustomers,
  addCustomer as addCustomerRedux,
  deleteCustomer as deleteCustomerRedux,
} from "../../redux/slices/customersSlices";

/* ================= TYPES ================= */
interface Customer {
  _id: string;
  name: string;
  phone?: string;
  totalDue: number;
  totalAmount:number
}

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ✅ Type the customers array
  const customers = useAppSelector((state) => state.customers.customers) as Customer[];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [due, setDue] = useState<string>("");

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const res = await axios.get<{ customers: Customer[] }>(
          `${serverUrl}/api/customers/get-all-customers`,
          { withCredentials: true }
        );
        dispatch(setCustomers(res.data.customers));
        console.log(res.data.customers)
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchAllCustomers();
  }, [dispatch]);

  /* ================= ADD CUSTOMER ================= */
  const addCustomer = async () => {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      const res = await axios.post<{ customer: Customer }>(
        `${serverUrl}/api/customers/add-customer`,
        { name, phone, due: Number(due || 0) },
        { withCredentials: true }
      );

      dispatch(addCustomerRedux(res.data.customer));

      setName("");
      setPhone("");
      setDue("");
    } catch (error) {
      console.error("Add customer failed:", error);
      alert("Failed to add customer");
    }
  };

  /* ================= DELETE CUSTOMER ================= */
  const deleteCustomer = async (customerId: string) => {
    try {
      await axios.delete(`${serverUrl}/api/customers/delete/${customerId}`, {
        withCredentials: true,
      });
      dispatch(deleteCustomerRedux(customerId));
    } catch (error) {
      console.error("Delete customer failed:", error);
      alert("Failed to delete customer");
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      {/* ================= ADD CUSTOMER ================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="border p-2 rounded-lg"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="Opening Due (optional)"
          type="number"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          onClick={addCustomer}
          className="bg-teal-600 text-white rounded-lg font-semibold"
        >
          Add Customer
        </button>
      </div>

      {/* ================= CUSTOMERS LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c: Customer) => (
          <div
            key={c._id}
            onClick={() => navigate(`/dashboard/customer/${c._id}`)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                {c.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">{c.name}</h3>
                <p className="text-sm text-gray-500">{c.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Due</p>
              <p
                className={`font-bold ${
                  c.totalAmount > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                Rs {c.totalAmount}
              </p>

              {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomer(c._id);
                }}
                className="text-sm text-red-600 hover:underline mt-1"
              >
                Delete
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Customers;
