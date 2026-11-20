import { FaUser, FaEnvelope, FaBox } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  // Get required values from ShopContext
  const { navigate, token, backendUrl } = useContext(ShopContext);

  // Store the logged-in user's information
  const [user, setUser] = useState(null);

  // Track loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the logged-in user's profile
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        // Request the user's information from the backend
        const response = await axios.get(backendUrl + "/api/user/profile", {
          headers: { token },
        });

        if (response.data.success) {
          // Store the user information
          setUser(response.data.user);
        } else {
          toast.error(response.data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error("Get Profile Error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load user profile",
        );
      } finally {
        // Stop loading after the request completes
        setIsLoading(false);
      }
    };
    // Redirect unauthenticated users to login
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    getUserProfile();
  }, [token, backendUrl, navigate]);

  // Displaying loading message
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  // Display message if user information is unavailable
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Unable to load your profile.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          View your account information and manage your orders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Account overview */}
        <div className="rounded-xl border border-gray-200 p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaUser className="text-3xl text-gray-500" />
          </div>

          <h2 className="mt-4 font-semibold text-gray-900">{user.username}</h2>

          <p className="mt-1 text-sm text-gray-500">{user.email}</p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm text-white transition hover:bg-gray-800"
          >
            <FaBox />
            View My Orders
          </button>
        </div>

        {/* Personal information */}
        <div className="rounded-xl border border-gray-200 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">Your account details.</p>

          <div className="mt-6 space-y-5">
            {/* Full name */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Username
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                <FaUser className="shrink-0 text-gray-400" />
                <span className="text-sm text-gray-800">{user.username}</span>
              </div>
            </div>

            {/* Email address */}
            <div>
              <label className="mb-2 block text-sm text-gray-500">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
                <FaEnvelope className="shrink-0 text-gray-400" />
                <span className="break-all text-sm text-gray-800">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
