import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth/login`;
      const response = await axios.post(url, { email, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", email);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
        
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center relative p-10">
          <img
            src="../assets/loginleft.png"
            alt="Login Illustration"
            className="w-3/4 max-w-lg"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          
          {/* Logo Placeholder */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-bold">Logo Here</h1>
          </div>

          {/* Login Heading */}
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            LOGIN
          </h2>
          
          {/* Error Message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4 relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none bg-gray-100"
                required
              />
              <FaEnvelope className="absolute right-4 top-4 text-gray-500" />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none bg-gray-100"
                required
              />
              <FaLock className="absolute right-4 top-4 text-gray-500" />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-4">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-red-500 hover:underline text-sm"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600"
            >
              Login Now
            </button>
          </form>

          {/* OR Divider */}
          <div className="text-center my-4 flex items-center justify-center">
            <div className="w-1/3 border-b border-gray-300"></div>
            <span className="mx-2 text-gray-500">OR</span>
            <div className="w-1/3 border-b border-gray-300"></div>
          </div>

          {/* Signup Button */}
          <button
            onClick={() => navigate("/register")}
            className="w-full border border-purple-500 text-purple-500 py-3 rounded-lg hover:bg-purple-500 hover:text-white transition"
          >
            Signup Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
