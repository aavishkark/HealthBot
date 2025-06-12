import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    axios
      .post("https://healthbotbackend-production.up.railway.app/login", user)
      .then((response) => {
        if (response.data.msg === "Login Successfull") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("isAuth", true);
          localStorage.setItem("email", email);
          alert("Login successful! Redirecting to dashboard.");
          navigate("/");
        } else {
          alert("Login failed! Please check your credentials.");
        }
      })
      .catch(() => {
        alert("Login failed! Please try again.");
      });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br p-6 mt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6"
      >

        <div className="relative">
          <span className="absolute left-3 top-3 text-blue-600">
            <FaEnvelope />
          </span>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-3 text-blue-600">
            <FaLock />
          </span>
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?
          <button
            type="button"
            className="ml-2 text-blue-700 hover:underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};