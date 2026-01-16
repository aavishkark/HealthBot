import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBirthdayCake,
  FaRulerVertical,
  FaWeightHanging,
  FaVenusMars,
  FaEnvelope,
  FaLock,
  FaDumbbell,
} from "react-icons/fa";
import { ArrowRight, CheckCircle } from "lucide-react";
import API from "../../Components/api";
import LoadingSpinner from "../../Components/ui/LoadingSpinner";
import loginImg from "../../assets/illustrations/excercise2.gif";
import "../Login/login.css";

export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    gender: "Male",
    activity: "1.2",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    API
      .post("/signup", form)
      .then((res) => {
        setLoading(false);
        if (res.data.msg === "User already registered") {
          alert("Email already registered. Please try again using a different email.");
        } else {
          alert("Signup successful! Please login to continue.");
          navigate("/login");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Signup failed! Please try again.");
      });
  };

  const fields = [
    { name: "name", icon: <FaUser />, placeholder: "Full Name", type: "text" },
    { name: "email", icon: <FaEnvelope />, placeholder: "Email Address", type: "email" },
    { name: "password", icon: <FaLock />, placeholder: "Password", type: "password" },
    { name: "age", icon: <FaBirthdayCake />, placeholder: "Age", type: "number" },
    { name: "height", icon: <FaRulerVertical />, placeholder: "Height (cm)", type: "number" },
    { name: "weight", icon: <FaWeightHanging />, placeholder: "Weight (kg)", type: "number" },
    {
      name: "gender",
      icon: <FaVenusMars />,
      type: "select",
      options: ["Male", "Female"],
      placeholder: "Gender",
    },
    {
      name: "activity",
      icon: <FaDumbbell />,
      type: "select",
      options: ["1.2", "1.375", "1.55", "1.725", "1.9"],
      optionLabels: [
        "Sedentary (Little or no exercise)",
        "Lightly active (1-3 days/week)",
        "Moderately active (3-5 days/week)",
        "Very active (6-7 days/week)",
        "Super active (Athlete level)",
      ],
      placeholder: "Activity Level",
    },
  ];

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">
                Start your health tracking journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="signup-grid">
                {fields.map((f) => (
                  <div
                    key={f.name}
                    className={`form-group ${f.name === "name" || f.name === "email" || f.name === "password" || f.name === "activity"
                      ? "signup-grid-full"
                      : ""
                      }`}
                  >
                    <label htmlFor={f.name} className="form-label">
                      {f.placeholder}
                    </label>
                    {f.type === "select" ? (
                      <select
                        id={f.name}
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        required
                        className="form-select"
                      >
                        {f.options.map((opt, i) => (
                          <option key={opt} value={opt}>
                            {f.optionLabels ? f.optionLabels[i] : opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="input-with-icon">
                        <input
                          id={f.name}
                          name={f.name}
                          type={f.type}
                          value={form[f.name]}
                          required
                          placeholder={f.placeholder}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="btn-auth gradient-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-illustration-section">
          <div className="illustration-wrapper">
            <div className="illustration-badge">
              <CheckCircle size={16} />
              <span>Join Now</span>
            </div>
            <img
              src={loginImg}
              alt="Health Tracking"
              className="auth-illustration"
            />
            <div className="illustration-stats">
              <div className="stat-bubble stat-bubble-1">
                <div className="stat-value">Free</div>
              </div>
              <div className="stat-bubble stat-bubble-3">
                <div className="stat-value">30 sec</div>
                <div className="stat-label">Quick Signup</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};