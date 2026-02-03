// import { useEffect, useState } from "react";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import axios from "axios";
// import { serverUrl } from "../../App";
// import { useNavigate } from "react-router-dom";
// const Customers = () => {
    
//   const [customers, setCustomers] = useState([
//     { id: 1, name: "Ali Khan", phone: "0301-1234567", due: 4500 },
//     { id: 2, name: "Ahmed Raza", phone: "0302-7654321", due: 1200 },
//     { id: 3, name: "Usman Tariq", phone: "0333-9876543", due: 9800 }
//   ]);
// const navigate= useNavigate();
  
//   useEffect(() => {
//   const fetchedAllcustomers = async () => {
//     try {
//       const allCustomers = await axios.get(
//         `${serverUrl}/api/customers/get-all-customers`,
//         { withCredentials: true }
//       );
//       console.log("all customers", allCustomers.data);
//       setCustomers(allCustomers.data.customers);
//     } catch (error) {
//       console.error("Failed to fetch customers:", error);
//     }
//   };
//   fetchedAllcustomers();
// }, []); // <-- empty array means run only once


//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [due, setDue] = useState("");

  
//   const addCustomer = async () => {
//   if (!name || !phone) {
//     alert("Name and phone are required");
//     return;
//   }

//   try {
//     const res = await axios.post(
//       `${serverUrl}/api/customers/add-customer`,
//       {
//         name,
//         phone,
//         due: Number(due || 0),
//       },
//       { withCredentials: true }
//     );

//     console.log("result customers", res.data);

//     // Add only the customer object
//     setCustomers([...customers, res.data.customer]);

//     // Clear inputs
//     setName("");
//     setPhone("");
//     setDue("");
//   } catch (error) {
//     console.error("Add customer failed:", error);
//     alert("Failed to add customer");
//   }
// };



//   const deleteCustomer = (id) => {
//     setCustomers(customers.filter(c => c.id !== id));
//   };

//   return (
//     <DashboardLayout>
//       <h2 className="text-2xl font-bold mb-4">Customers</h2>

//       {/* Add Customer */}
//       <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
//         <input
//           className="border p-2 rounded-lg"
//           placeholder="Customer Name"
//           value={name}
//           onChange={e => setName(e.target.value)}
//         />
//         <input
//           className="border p-2 rounded-lg"
//           placeholder="Phone"
//           value={phone}
//           onChange={e => setPhone(e.target.value)}
//         />
//         <input
//           className="border p-2 rounded-lg"
//           placeholder="Opening Due (optional)"
//           type="number"
//           value={due}
//           onChange={e => setDue(e.target.value)}
//         />
//         <button
//           onClick={addCustomer}
//           className="bg-teal-600 text-white rounded-lg font-semibold"
//         >
//           Add Customer
//         </button>
//       </div>

//       {/* Customers List */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

//         {customers.map((c,index) => (
//           <div
//             key={index}
//             onClick={() => navigate(`/dashboard/customer/${c._id}`)}
//             className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center justify-between"
//           >
//             <div  className="flex items-center gap-4">
//               {/* Avatar */}
//               <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
//                 {c.name.charAt(0)}
//               </div>

//               <div>
//                 <h3 className="font-semibold text-gray-800">{c.name}</h3>
//                 <p className="text-sm text-gray-500">{c.phone}</p>
//               </div>
//             </div>

//             <div className="text-right">
//               <p className="text-sm text-gray-500">Due</p>
//               <p
//                 className={`font-bold ${
//                   c.due > 0 ? "text-red-600" : "text-green-600"
//                 }`}
//               >
//                 Rs {c.due}
//               </p>

//               <button
//                 onClick={() => deleteCustomer(c.id)}
//                 className="text-xs text-red-500 hover:underline mt-2"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         ))}

//       </div>
//     </DashboardLayout>
//   );
// };

// export default Customers;

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomers,
  addCustomer as addCustomerRedux,
  deleteCustomer as deleteCustomerRedux,
} from "../../redux/slices/customersSlices";

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const customers = useSelector((state) => state.customers.customers);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [due, setDue] = useState("");

  // =========================
  // Fetch customers
  // =========================
  useEffect(() => {
    const fetchedAllcustomers = async () => {
      try {
        const allCustomers = await axios.get(
          `${serverUrl}/api/customers/get-all-customers`,
          { withCredentials: true }
        );
        dispatch(setCustomers(allCustomers.data.customers));
        // console.log("total", allCustomers.data.customers); 
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchedAllcustomers();
  }, [dispatch]);

  // =========================
  // Add customer
  // =========================
  const addCustomer = async () => {
    if (!name || !phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/customers/add-customer`,
        {
          name,
          phone,
          due: Number(due || 0),
        },
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

  // =========================
  // Delete customer
  // =========================
  const deleteCustomer = async (id) => {
    try {
      await axios.delete(
        `${serverUrl}/api/customers/delete/${id}`,
        { withCredentials: true }
      );
      dispatch(deleteCustomerRedux(id));
    } catch (error) {
      console.error("Delete customer failed:", error);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      {/* Add Customer */}
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

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c, index) => (
          <div
            key={c._id || index}
            onClick={() => navigate(`/dashboard/customer/${c._id}`)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center justify-between"
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
                  c.totalDue > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                Rs {c.totalDue}
              </p>

            
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Customers;

