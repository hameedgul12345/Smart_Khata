import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { serverUrl } from "../App";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser } from "../redux/slices/userSlice";
 
import type { RootState } from "../redux/store";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

function useGetUser(): { user: User | null; loading: boolean; error: string | null } {

const user = useAppSelector((state: RootState) => state.user.user);
  // console.log("user Profile",user)
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get<{ user: User }>(`${serverUrl}/api/user/me`, { withCredentials: true });
        if (isMounted) dispatch(setUser(res.data.user));
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        if (isMounted) setError(error.response?.data?.message || "Failed to load user");
        console.error("Get user failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  return { user, loading, error };
}

export default useGetUser;
