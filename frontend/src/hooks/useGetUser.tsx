import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice"; // ✅ IMPORT THIS

function useGetUser() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ If user already exists, don't refetch
    if (user) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/me`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));
        // console.log(res.data.user)
      } catch (err) {
        console.error("Get user failed:", err);
        setError(err.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, user]);

  return { user, loading, error };
}

export default useGetUser;
