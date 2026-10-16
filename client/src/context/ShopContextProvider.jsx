import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import the ShopContext so we can provide data to
// other components in the application
import { ShopContext } from "../context/ShopContext";

// Import toast so we can display message to the user
import { toast } from "react-toastify";

const ShopContextProvider = (props) => {
  const currency = "$";
  // Fixed delivery fee
  const delivery_fee = 10;

  // Get the backend API URL from the Vite environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Store the current search text
  const [search, setSearch] = useState("");

  // Control whether the search bar is visible
  // false = hidden
  // true = visible
  const [showSearch, setShowSearch] = useState(false);

  // Store all cart items in state
  const [cartItems, setCartItems] = useState({});

  // Store the products retrieved from the backend API
  // Initially, the products array is empty
  const [products, setProducts] = useState([]);

  const [token, setToken] = useState("");

  const navigate = useNavigate();

  // Add a product to the cart
  // itemId = the product ID
  // size = the selected product size
  const addToCart = async (itemId, size) => {
    // Make sure the customer selected a size
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Make a copy of the current cart
    // We don't want to directly change cartItems
    let cartData = structuredClone(cartItems);

    // Check if this product already exists in the cart
    if (cartData[itemId]) {
      // Check if this product already has this size
      if (cartData[itemId][size]) {
        // Product and size already exists
        // Increase the quantity by 1
        cartData[itemId][size] += 1;
      } else {
        // Product exists, but this size doesn't
        // Add the size with quantity 1
        cartData[itemId][size] = 1;
      }
    } else {
      // Product does not exist in the cart yet
      // Add the selected size with quantity 1
      cartData[itemId] = {
        [size]: 1,
      };
    }

    // Check whether the customer is logged in
    if (token) {
      try {
        // Send the product ID and selected size to the backend
        const response = await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } },
        );

        // Check whether the product was successfully added
        if (response.data.success) {
          // Update React state after Firestore succeeds
          setCartItems(cartData);

          // Display a success message
          toast.success(response.data.message);
        } else {
          // Display the backend error message
          toast.error(response.data.message);
        }
      } catch (err) {
        console.error("Add To Cart Error", err);
        toast.error(
          err.response?.data?.message ||
            "Product could not be added to the cart.",
        );
      }
    } else {
      // Allow guests to add products to their local cart
      setCartItems(cartData);
    }
  };

  // Calculate the total number of products in the cart.
  const getCartCount = () => {
    // Start the total quantity at 0
    let totalCount = 0;
    // Loop through each product in the cart
    for (const items in cartItems) {
      // Loop through each size for the current product
      for (const item in cartItems[items]) {
        try {
          // Only count items that have a quantity greater than 0
          if (cartItems[items][item] > 0) {
            // Add the quantity to the total
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    // Return the total number of products
    return totalCount;
  };

  // Update the quantity of a specific product and size
  // itemId = product ID
  // size = product size
  // quantity = new quantity
  const updateQuantity = async (itemId, size, quantity) => {
    // Make sure the quantity is valid
    if (!Number.isInteger(quantity) || quantity < 0) {
      toast.error("Invalid product quantity");
      return;
    }
    // Make a copy of the current cart
    let cartData = structuredClone(cartItems);

    // Check whether the product exists in the cart
    if (!cartData[itemId]) {
      return;
    }

    // Remove the selected size if quantity is zero
    if (quantity === 0) {
      delete cartData[itemId][size];

      // Remove the product if no sizes remain
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      //Update the quatity for this product and size
      cartData[itemId][size] = quantity;
    }

    // Check whether the customer is logged in
    if (token) {
      try {
        // Save the updated quantity to Firestore
        const response = await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } },
        );

        // Update React state only if Firestore succeeds
        if (response.data.success) {
          setCartItems(cartData);
        } else {
          toast.error(response.data.message);
        }
      } catch (err) {
        console.error("Update Quantity Error", err);
        toast.error(
          err.response?.data?.message ||
            "product quantiy could not be updated.",
        );
      }
    } else {
      // Update the local cart for guests
      setCartItems(cartData);
    }
  };
  // Calculate the total price of all products in the cart
  const getCartAmount = () => {
    // Start the total amount at $0
    let totalAmount = 0;
    // Loop through each product in the cart
    for (const items in cartItems) {
      // Find the product information using its ID
      let itemInfo = products.find((product) => product.id === items);

      // Skip this product if it no longer exists
      if (!itemInfo) {
        console.warn("Product not found in cart:", items);
        continue;
      }

      // Loop through each size of the current product
      for (const item in cartItems[items]) {
        try {
          // Only calculate products with a quantity greater than 0
          if (cartItems[items][item] > 0) {
            // product price * quantity
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart amount:", error);
        }
      }
    }
    // Return the total cart price
    return totalAmount;
  };

  // Fetch all products from the backend API
  const getProductsData = async () => {
    try {
      // Send GET request to retrieve all products
      const response = await axios.get(backendUrl + "/api/product/list");

      // Check whether the request was successful
      if (response.data.success) {
        // Store the retrieved products in React state
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching products:", err);

      // Display the backend error message or a fallback message
      toast.error(
        err.response?.data?.message ||
          "Failed to load products. Please try again.",
      );
    }
  };

  // Retrieve the logged-in customer's cart from Firestore
  const getUserCart = async (token) => {
    try {
      // Send a request to retrieve the user's saved cart
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } },
      );
      // Check whether the request was successful
      if (response.data.success) {
        // Store the retrieved cart in React state
        setCartItems(response.data.cartData || {});
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Get User Cart Error:", err);

      // Display the backend error message or a fallback message
      toast.error(
        err.response?.data?.message || "Failed to load your shopping cart.",
      );
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  // Put all the data and functions that
  // other components need to access into one object
  const value = {
    // Product data
    products,
    // Shop settings
    currency,
    delivery_fee,

    // Search
    search,
    setSearch,
    showSearch,
    setShowSearch,

    // Cart
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,

    // Backend URL
    backendUrl,

    // Authentication
    setToken,
    token,
  };

  // Provide all of the values above to components inside ShopContext.Provider
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
