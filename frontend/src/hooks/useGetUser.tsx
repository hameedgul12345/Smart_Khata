import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { serverUrl } from "../App";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // ✅ typed hooks
import { setUser } from "../redux/slices/userSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  // add any other fields your API returns
}

function useGetUser() {
  // Use typed hooks instead of plain useSelector/useDispatch
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get<{ user: User }>(`${serverUrl}/api/user/me`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || "Failed to load user");
        console.error("Get user failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, user]);

  return { user, loading, error };
}

export default useGetUser;
