import { useState } from "react";
import { useAuth } from "../../Components/authContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import API from "../../Components/api";
import { Button,CircularProgress, Alert,Snackbar } from "@mui/material";
import {
  Send as SendIcon,
} from '@mui/icons-material';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [openalert, setOpenalert] = useState(false);

  const handleClosealert = () => setOpenalert(false);
  const handleOpenalert = () => setOpenalert(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    API
      .post("/login", user)
      .then((response) => {
        setloading(true)
        if (response.data.msg === "Login Successfull") {
          setloading(false);
          handleOpenalert()
          login();
          navigate("/");
        } else {
          alert("Login failed! Please check your credentials.");
        }
      })
      .catch(() => {
        setloading(false);
        alert("Login failed! Please try again.");
      })
      .finally(()=>{
        setloading(false);
      })
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
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
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
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-transparent text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <Button
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-blue-600 hover:to-indigo-700 transition"
          type="submit"
          fullWidth
          sx={{ mt: 2, color: 'white' }}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        >
          {loading ? 'Please wait our server might be just waking up...' : 'Login'}
        </Button>

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
      <Snackbar
        open={openalert}
        autoHideDuration={3000}
        onClose={handleClosealert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
          Logged In Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};