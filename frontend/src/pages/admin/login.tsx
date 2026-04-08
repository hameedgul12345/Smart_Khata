import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "@/App";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slices/userSlice";
import type { User } from "../../redux/slices/userSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${serverUrl}/api/user/admin/login`, form, {
        withCredentials: true, // ✅ required for cookies
      });

      // dispatch user
      dispatch(setUser(res.data.user));

      // no need to store token
      navigate("/admin");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-6 shadow rounded w-80 bg-white">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          className="border p-2 w-full mb-2 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800 transition"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
