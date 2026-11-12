import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/common/Title";
import axios from "axios";

const Orders = () => {
  // Get backend URL, authentication token, and currency from ShopContext
  const { backendUrl, token, currency } = useContext(ShopContext);

  // Store the authenticated user's order items
  const [orderData, setOrderData] = useState([]);

  // Fetch the authenticated user's orders from the backend
  const loadOrderData = async () => {
    try {
      // Stop if the user is not authenticated
      if (!token) {
        return null;
      }

      // Send a POST request to retrieve the user's orders
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } },
      );

      // Check whether the request was successful
      if (response.data.success) {
        // Create an empty array to store all order items
        let allOrdersItem = [];

        // Loop through each order returned from the backend
        response.data.orders.map((order) => {
          // Loop through each product in the order
          order.items.map((item) => {
            // Add order details to each product item
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;

            // Add the product item to the combined orders array
            allOrdersItem.push(item);
          });
        });
        // Reverse the order items and update React state
        setOrderData(allOrdersItem.reverse());
      }
    } catch (err) {
      console.error("Load Orders Error:", err);
    }
  };

  // Fetch orders when the component loads or the token changes
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      {/* Page Title */}
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Display all order items */}
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4 border-t border-b text-secondary-foreground"
          >
            {/* Product image and order information */}
            <div className="flex items-start gap-6 text-sm">
              {/* Product image */}
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />

              {/* Product details */}
              <div>
                {/* Product name */}
                <p className="sm:text-base font-medium">{item.name}</p>

                {/* Price, quantity, and selected size */}
                <div className="flex items-center gap-3 mt-1 text-base text-secondary-foreground/60">
                  <p>
                    {currency} {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size} </p>
                </div>

                {/* Order date */}
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-secondary-foreground/60">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>

                {/* Payment method */}
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-secondary-foreground/60">
                    {item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            {/* Order status and tracking button */}
            <div className="md:w-1/2 flex justify-between">
              {/* Current order status */}
              <div className="flex items-center gap-2">
                {/* Green status indicator */}
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>

                {/* Order status text */}
                <p className="text-sm md:text-base">{item.status}</p>
              </div>

              {/* Refresh order information */}
              <button
                onClick={loadOrderData}
                className="border bg-primary text-primary-foreground hover:bg-primary/20 px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Orders;
