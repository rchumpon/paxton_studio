import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  // Get required values from ShopContext
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  // Store current form mode
  const [currentState, setCurrentState] = useState("Login");

  // Store user registration and login information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Track form submission status
  const [isLoading, setIsLoading] = useState(false);

  // Handle login and registration
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (currentState === "Sign Up") {
        // Send registration details to the backend
        const response = await axios.post(backendUrl + "/api/auth/register", {
          username: name,
          email,
          password,
        });

        // Check if registration was successful
        if (response.data.success) {
          // Save the JWT token in React state
          setToken(response.data.token);

          // Save the JWT token in localStorage
          localStorage.setItem("token", response.data.token);
        } else {
          // Display registration error
          toast.error(response.data.message);
        }
      } else {
        // Send login details to the backend
        const response = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        // Check if login was successful
        if (response.data.success) {
          // Save the JWT token in React state
          setToken(response.data.token);

          // Save the JWT token in localStorage
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      // Display the backend error message or fallback message
      toast.error(
        err.response?.data?.message ||
          "Authentication failed. Please try again.",
      );
    } finally {
      // Reset loading state after submission
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-muted"
    >
      {/* Form Title */}
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-secondary-foreground" />
      </div>

      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          placeholder="Name"
          className="w-full px-3 py-2 border border-border"
          required
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        value={email}
        placeholder="Email"
        className="w-full px-3 py-2 border border-border"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        value={password}
        placeholder="Password"
        className="w-full px-3 py-2 border border-border"
        required
      />
      <div className="w-full flex justify-between text-sm -mt-2">
        <p className="cursor-pointer">Forgot your password</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>
      <button className="bg-primary text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};
export default Login;
