import { useState, type ChangeEvent } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import axios from "axios";
import { setUser } from "../../redux/slices/userSlice";
import { motion } from "framer-motion";
import { serverUrl } from "../../App";

/* -------------------- Types -------------------- */
interface User {
  _id: string;
  name: string;
  email: string;
  shopName?: string;
  profilePicture?: string;
}

/* -------------------- Component -------------------- */
const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user.user) as User | null;

  const [name, setName] = useState(user?.name ?? "");
  const [shopName, setShopName] = useState(user?.shopName ?? "");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(
    user?.profilePicture
  );
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);

      const reader = new FileReader();
      reader.onload = (event) =>
        setProfilePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("shopName", shopName);
      if (profileFile) formData.append("profilePicture", profileFile);

      const res = await axios.put(
        `${serverUrl}/api/user/update-profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      dispatch(setUser(res.data));
      setProfilePreview(res.data.profilePicture);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-8 text-white flex items-center gap-5">

              {/* IMAGE */}
              <div className="relative group">
                <motion.img
                  src={
                    profilePreview ||
                    `https://ui-avatars.com/api/?name=${user?.name}`
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                  whileHover={{ scale: 1.05 }}
                />

                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow hover:scale-105 transition">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 16l4-4m0 0l4 4m-4-4V4"
                    />
                  </svg>
                </label>
              </div>

              {/* INFO */}
              <div>
                <h2 className="text-2xl font-bold">My Profile</h2>
                <p className="text-sm text-gray-300">{user?.email}</p>
              </div>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-6">

              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              {/* SHOP NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:outline-none transition"
                  placeholder="Enter your shop name"
                />
              </div>

              {/* SAVE BUTTON */}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-all disabled:opacity-60"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>

          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;