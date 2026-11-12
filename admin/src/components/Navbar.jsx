import { assets } from "../assets/assets";

function Navbar({ setToken }) {
  // Log out the administrator
  const logout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token");

    // Clear authentication state
    setToken("");
  };
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img src={assets.Paxton_Logo} alt="Paxton" className="w-24 h-auto" />
      <button
        onClick={logout}
        className="bg-gray-600 text-primary-foreground px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
}
export default Navbar;
