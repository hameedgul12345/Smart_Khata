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
}

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      // ✅ Store user in Redux
      dispatch(setUser(res.data.user));

      // ✅ Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 to-slate-200">
      
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-600 to-cyan-700 text-white items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,white,transparent_70%)]"></div>

        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Join Us 👋
          </h1>
          <p className="text-lg opacity-90">
            Create an account to start managing your Khata system efficiently.
          </p>

          <img
            src="/images/image1.png"
            alt="Signup Illustration"
            className="mt-10 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-100">

            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Sign Up
            </h2>
            <p className="text-gray-500 mb-6">
              Enter your details to create an account
            </p>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition transform disabled:opacity-60"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-teal-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;