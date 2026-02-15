import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setItems } from "../redux/slices/itemsSlice";
import { serverUrl } from "../App";

/* ================= TYPES ================= */

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  totalPrice: number;
}

/* ================= HOOK ================= */

const useGetItems = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get<{ items: Product[] }>(
          `${serverUrl}/api/items/get-items`,
          { withCredentials: true },
        );

        setProducts(res.data.items);
        dispatch(setItems(res.data.items));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return { products, loading, error };
};

export default useGetItems;
