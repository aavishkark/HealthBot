import { useState } from "react";
import { useAuth } from "../../Components/authContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import API from "../../Components/api";
import { Snackbar, Alert } from "@mui/material";
import { ArrowRight, Sparkles } from "lucide-react";
import LoadingSpinner from "../../Components/ui/LoadingSpinner";
import loginImg from "../../assets/illustrations/login.png";
import "./login.css";

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
    setloading(true);
    API
      .post("/login", user)
      .then((response) => {
        if (response.data.msg === "Login Successfull") {
          setloading(false);
          handleOpenalert();
          login();
          navigate("/");
        } else {
          setloading(false);
          alert("Login failed! Please check your credentials.");
        }
      })
      .catch(() => {
        setloading(false);
        alert("Login failed! Please try again.");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="logo-emoji">🥗</span>
                <span className="logo-text gradient-text">HealthBot</span>
              </div>
              <h1 className="auth-title">Welcome Back!</h1>
              <p className="auth-subtitle">
                Sign in to continue tracking your health journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-auth gradient-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </p>
            </div>

            {loading && (
              <div className="loading-message animate-fade-in">
                <Sparkles size={16} className="sparkle-icon" />
                <span>Our server might be waking up, please wait...</span>
              </div>
            )}
          </div>
        </div>

        <div className="auth-illustration-section">
          <div className="illustration-wrapper">
            <div className="illustration-badge">
              <Sparkles size={16} />
              <span>Track. Analyze. Achieve.</span>
            </div>
            <img
              src={loginImg}
              alt="Health Tracking"
              className="auth-illustration"
            />
            <div className="illustration-stats">
              <div className="stat-bubble stat-bubble-1">
                <div className="stat-value">1000+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-bubble stat-bubble-2">
                <div className="stat-value">AI-Powered</div>
                <div className="stat-label">Insights</div>
              </div>
              <div className="stat-bubble stat-bubble-3">
                <div className="stat-value">100% Free</div>
                <div className="stat-label">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={openalert}
        autoHideDuration={3000}
        onClose={handleClosealert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClosealert}
          severity="success"
          sx={{ width: "100%" }}
        >
          ✨ Logged in successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};