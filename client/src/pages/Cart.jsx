import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/common/Title";
import { FaTrash } from "react-icons/fa";
import CartTotal from "../components/layout/CartTotal";

// Get cart and product data/functions from ShopContext
const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  // Store cart items in an easier format to display
  const [cartData, setCartData] = useState([]);

  // Run whenever cartItems changes
  useEffect(() => {
    // Temporary array for storing cart items
    const temporaryData = [];

    // Go through each size for that product
    for (const items in cartItems) {
      // Only add items with a quantity greater than 0
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          temporaryData.push({
            id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    // console.log(temporaryData);

    // Save the cart items into React state
    setCartData(temporaryData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14">
      {/* Cart title */}
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {/* Display all cart items */}
      <div>
        {cartData.map((item, index) => {
          // Find the full product information using the product ID from cartData
          const productData = products.find(
            (product) => product.id === item.id,
          );

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-secondary-foreground grid grid-cols[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              {/* Product information */}
              <div className="flex items-start gap-6">
                {/* Product image */}
                <img src={productData.image[0]} className="w-16 sm:w-20" />
                <div>
                  {/* Product name */}
                  <p className="text-sm sm:text-lg font-medium">
                    {productData.name}
                  </p>

                  {/* Price and size */}
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>

                    {/* Selected size */}
                    <p className="px-2 sm:px-3 sm:py-1 border bg-muted/10">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity input */}
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(item.id, item.size, Number(e.target.value))
                }
                type="number"
                min={1}
                defaultValue={item.quantity}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
              />

              {/* Remove item from cart */}
              <FaTrash
                onClick={() => updateQuantity(item.id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {/* Cart total and checkout */}
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-112.5">
          {/* Calculate and display cart total */}
          <CartTotal />

          {/* Go to checkout */}
          <div
            onClick={() => navigate("/place-order")}
            className="w-full text-end"
          >
            <button className="bg-primary text-primary-foreground text-sm my-8 px-8 py-3 rounded-lg">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
