import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronRight,
  FaBox,
  FaSignOutAlt,
} from "react-icons/fa";
import { ShopContext } from "../../context/ShopContext";

function Navbar() {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem("token");

    // Clear authentication state
    setToken("");

    // Clear cart items
    setCartItems({});

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.Paxton_Logo} alt="Paxton" className="w-24 h-auto" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <FaSearch
          onClick={() => setShowSearch(true)}
          alt=""
          className="w-5 text-muted cursor-pointer"
        />
        <div className="group relative">
          <FaUser
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 text-muted cursor-pointer"
          />
          {/* Dropdown Menu */}
          {token && (
            <div className="absolute right-0 z-50 hidden pt-4 group-hover:block">
              <div className="flex w-44 flex-col gap-1 rounded-lg border border-gray-100 bg-white p-2 text-sm text-gray-600 shadow-lg">
                {/* My profile */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100 hover:text-black"
                >
                  <FaUser className="text-base" />
                  My Profile
                </button>

                {/* My orders */}
                <button
                  onClick={() => navigate("/orders")}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-100 hover:text-black"
                >
                  <FaBox className="text-base" />
                  Orders
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <FaSignOutAlt className="text-base" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <FaShoppingCart className="w-5 min-w-5 text-muted" />
          <p className="absolute -right-2 -top-2 w-4 h-4 px-1 flex items-center justify-center bg-red-400 text-white rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <FaBars
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden text-muted"
        />
      </div>
      {/* Sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <FaChevronRight className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
