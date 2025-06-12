import axios from "axios";
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

export const Signup = () => {
  const navigate = useNavigate();
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
    axios
      .post(
        "https://healthbotbackend-production.up.railway.app/signup",
        form
      )
      .then(() => {
        alert("Signup successful! Please login to continue.");
        navigate("/login");
      })
      .catch(() => {
        alert("Signup failed! Please try again.");
      });
  };

  const fields = [
    { name: "name", icon: <FaUser />, placeholder: "Name", type: "text" },
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
    { name: "email", icon: <FaEnvelope />, placeholder: "Email", type: "email" },
    { name: "password", icon: <FaLock />, placeholder: "Password", type: "password" },
    {
      name: "activity",
      icon: <FaDumbbell />,
      type: "select",
      options: ["1.2", "1.375", "1.55", "1.725", "1.9"],
      optionLabels: [
        "Sedentary",
        "Lightly active",
        "Moderately active",
        "Very active",
        "Super active",
      ],
      placeholder: "Activity Level",
    },
  ];

  return (
    <div className="flex items-center justify-center px-4 mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-40 max-w-md w-full p-8 space-y-6"
      >

        {fields.map((f) => (
          <div key={f.name} className="relative">
            <span className="absolute left-3 top-3 text-blue-600">{f.icon}</span>
            {f.type === "select" ? (
              <select
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
              >
                <option value="">{f.placeholder}</option>
                {f.options.map((opt, i) => (
                  <option key={opt} value={opt}>
                    {f.optionLabels ? f.optionLabels[i] : opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                required
                placeholder={f.placeholder}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition transition"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-600 font-medium hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};