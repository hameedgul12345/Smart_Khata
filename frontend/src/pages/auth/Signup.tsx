import { useState, type ChangeEvent, type FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/slices/userSlice";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.user));
      navigate("/dashboard");

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      if (!error.response) {
        setError("Network error. Try again.");
      } else {
        setError(error.response.data?.message || "Signup failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B1120] text-white">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A9899]/20 to-transparent blur-3xl"></div>

        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">
            Join Us 👋
          </h1>
          <p className="text-gray-300">
            Create your account and start managing your business smarter.
          </p>

          <img src="/images/image1.png" className="mt-10 opacity-90" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-2">
            Sign Up
          </h2>

          <p className="text-gray-400 mb-6">
            Create your account to continue
          </p>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-[#1A9899] focus:ring-2 focus:ring-[#1A9899]/40 outline-none"
              required
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-[#1A9899] focus:ring-2 focus:ring-[#1A9899]/40 outline-none"
              required
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-[#1A9899] focus:ring-2 focus:ring-[#1A9899]/40 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* CONFIRM PASSWORD */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-[#1A9899] focus:ring-2 focus:ring-[#1A9899]/40 outline-none"
              required
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A9899] hover:bg-[#157c7d] py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#1A9899] font-semibold">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;