import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  // Get search state from ShopContext
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);

  // Control whether SearchBar should be visible
  const [visible, setVisible] = useState(false);

  // Get the current URL/page
  const location = useLocation();

  // Check the current page whenever the URL changes
  useEffect(() => {
    console.log(location.pathname);
    // Show SearchBar only on the Collection page
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  // Show SearchBar only when both conditions are true
  // 1. showSearch = true
  // 2. visible = true (Collection page)
  return showSearch && visible ? (
    <div className="border-t border-b bg-linear-to-b from-secondary via-background/10 to-background text-center">
      <div className="inline-flex items-center justify-center border border-border px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2">
        {/* Update search text when user types */}
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <FaSearch className="text-muted/50 w-4" />
      </div>
      {/* Close SearchBar */}
      <FaTimes
        onClick={() => setShowSearch(false)}
        className="inline w-3 text-muted/50 cursor-pointer"
      />
    </div>
  ) : null;
};
export default SearchBar;
