import { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  // Get required values and functions from ShopContext
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);

  // Read Stripe payment information from URL query parameters
  const [searchParams] = useSearchParams();

  // Get payment result, order ID, and Stripe Checkout Session ID
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  // Track payment verification status
  const [isVerifying, setIsVerifying] = useState(true);

  // Prevent duplicate verification requests
  const verificationStarted = useRef(false);

  useEffect(() => {
    // Wait untill the authentication token is available
    if (!token) {
      return;
    }

    // Prevent duplicate requests
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    // Verify payment with the backend
    const verifyPayment = async () => {
      try {
        // Check whether the customer cancelled Stripe checkout
        if (success === "false") {
          toast.error("Stripe payment was cancelled");
          navigate("/cart", { replace: true });
          return;
        }

        // Validate the required payment information
        if (!orderId || !sessionId) {
          toast.error("Missing payment verification information");
          navigate("/cart", { replace: true });
          return;
        }
        // Request payment verification from the backend
        const response = await axios.post(
          backendUrl + "/api/order/verifyStripe",
          {
            orderId,
            sessionId,
          },
          {
            headers: { token },
          },
        );
        // Check whether Stripe payment was verified successfully
        if (response.data.success) {
          // Clear the shopping cart after confirmed payment
          setCartItems({});

          // Display successful payment message
          toast.success("Payment verified successfully");

          // Redirect the customer to their orders page
          navigate("/orders", { replace: true });
        } else {
          // Display verification failure message
          toast.error(response.data.message || "Payment verification failed");
          // Redirect to the shopping cart
          navigate("/cart", { replace: true });
        }
      } catch (error) {
        console.error("Stripe Verification Error:", error);

        // Display backend error message
        toast.error(
          error.response?.data?.message || "Unable to verify your payment",
        );
        // Avoid redirecting automatically on an unexpected error:
        // the payment may have succeeded even if verification failed
      } finally {
        // Stop displaying the loading message
        setIsVerifying(false);
      }
    };
    verifyPayment();
  }, [token, success, orderId, sessionId, backendUrl, navigate, setCartItems]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      {isVerifying ? (
        <p className="text-gray-600">Verifying your payment...</p>
      ) : (
        <p className="text-gray-600">
          Payment verification could not be completed. Please check your orders
          before trying again.
        </p>
      )}
    </div>
  );
};
export default Verify;
