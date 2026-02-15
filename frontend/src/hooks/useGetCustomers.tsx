import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCustomers } from "../redux/slices/customersSlices";
import { serverUrl } from "../App";

/* ================= TYPES ================= */

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  totalDue: number;
  
}

/* ================= HOOK ================= */

const useGetCustomers = () => {
  const dispatch = useDispatch();
  const [customers, setLocalCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get<{ customers: Customer[] }>(
          `${serverUrl}/api/customers/get-all-customers`,
          { withCredentials: true }
        );

        setLocalCustomers(res.data.customers);
        dispatch(setCustomers(res.data.customers));
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomers();
  }, [dispatch]);

  return { customers, loading, error };
};

export default useGetCustomers;
