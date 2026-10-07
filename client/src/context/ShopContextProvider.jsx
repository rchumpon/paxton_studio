import { useState } from "react";
// Import the product data from our assets file
import { products } from "../assets/assets";
// Import the ShopContext so we can provide data to
// other components in the application
import { ShopContext } from "../context/ShopContext";
// Import toast so we can display message to the user
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ShopContextProvider = (props) => {
  const currency = "$";
  // Fixed delivery fee
  const delivery_fee = 10;
  // Store the current search text
  const [search, setSearch] = useState("");
  // Control whether the search bar is visible
  // false = hidden
  // true = visible
  const [showSearch, setShowSearch] = useState(false);

  // Store all cart items in state
  const [cartItems, setCartItems] = useState({});

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
      // Create an empty object for this product
      cartData[itemId] = {};
      // Add the selected size with quantity 1
      cartData[itemId][size] = 1;
    }

    // console.log(cartData);
    // Save the updated cart back into React state
    setCartItems(cartData);
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
        } catch (error) {}
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
    // Make a copy of the current cart
    let cartData = structuredClone(cartItems);

    // Update the quantity for this product and size
    cartData[itemId][size] = quantity;

    // Save the updated cart
    setCartItems(cartData);
  };

  // Calculate the total price of all products in the cart
  const getCartAmount = () => {
    // Start the total amount at $0
    let totalAmount = 0;
    // Loop through each product in the cart
    for (const items in cartItems) {
      // Find the product information using its ID
      let itemInfo = products.find((product) => product.id === items);
      // Loop through each size of the current product
      for (const item in cartItems[items]) {
        try {
          // Only calculate products with a quantity greater than 0
          if (cartItems[items][item] > 0) {
            // product price * quantity
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    // Return the total cart price
    return totalAmount;
  };

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
  };

  // Provide all of the values above to components inside ShopContext.Provider
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
