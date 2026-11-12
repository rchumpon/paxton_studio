import { FaPaypal, FaStripe } from "react-icons/fa6";
import Title from "../components/common/Title";
import CartTotal from "../components/layout/CartTotal";
import axios from "axios";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    suburb: "",
    state: "",
    postcode: "",
    country: "",
    phone: "",
  });

  // Update delivery information when the user types
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let orderItems = [];

      // Loop through each product in the cart
      for (const itemId in cartItems) {
        // Loop through each selected size
        for (const size in cartItems[itemId]) {
          // Check if the quantity is greater than zero
          if (cartItems[itemId][size] > 0) {
            // Find the matching product
            const product = products.find((product) => product.id === itemId);

            if (product) {
              // Clone the product to avoid modifying the original
              const itemInfo = structuredClone(product);

              //Add selected size and quantity
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];

              // Add product to the order
              orderItems.push(itemInfo);
            }
          }
        }
      }

      // console.log(orderItems);

      // Prepare order information
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        // API calls for Cash on delivery
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } },
          );

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }

          break;
        }
        default:
          toast.error("Please select a valid payment method");
          break;
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-120">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex flex-row gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            required
            type="text"
            placeholder="First Name"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            required
            type="text"
            placeholder="Last Name"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          required
          type="email"
          placeholder="Email address"
          className="border border-border rounded py-1.5 px-3.5 w-full"
        />
        <input
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          required
          type="text"
          placeholder="Street Address"
          className="border border-border rounded py-1.5 px-3.5 w-full"
        />

        <div className="flex flex-row gap-3">
          <input
            onChange={onChangeHandler}
            name="suburb"
            value={formData.suburb}
            required
            type="text"
            placeholder="Suburb"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            required
            type="text"
            placeholder="State"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex flex-row gap-3">
          <input
            onChange={onChangeHandler}
            name="postcode"
            value={formData.postcode}
            required
            type="number"
            placeholder="Postcode"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            required
            type="text"
            placeholder="Country"
            className="border border-border rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          required
          type="number"
          placeholder="Phone"
          className="border border-border rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment Method */}
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Stripe */}
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              {/* Selection Circle */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <FaStripe className="text-4xl text-[#635BFF]" />
            </div>
            {/* Paypal */}
            <div
              onClick={() => setMethod("paypal")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              {/* Selection Circle */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "paypal" ? "bg-green-400" : ""}`}
              ></p>
              <FaPaypal className="text-4xl text-[#033087]" />
            </div>
            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              {/* Selection Circle */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-muted text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-16 py-3 text-sm rounded-lg"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default PlaceOrder;
