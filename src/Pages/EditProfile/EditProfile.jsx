import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser, FaBirthdayCake, FaRulerVertical, FaWeightHanging, FaVenusMars, FaEnvelope, FaDumbbell } from "react-icons/fa";

export const EditProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [form, setForm] = useState({ name:"", age:"", height:"", weight:"", gender:"", email:"", activity:"" });
  const email = localStorage.getItem("email");

  useEffect(() => {
    axios.get("https://healthbotbackend.onrender.com/getProfile", { params:{ email }})
      .then(res => {
        setUserProfile(res.data.user);
        setForm({
          name: res.data.user.name,
          age: res.data.user.age,
          height: res.data.user.height,
          weight: res.data.user.weight,
          gender: res.data.user.gender,
          email: res.data.user.email,
          activity: res.data.user.activitylevel
        });
      });
  }, [email]);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleUpdate = e => {
    e.preventDefault();
    axios.patch(`https://healthbotbackend.onrender.com/updateProfile/${userProfile._id}`,
      { ...userProfile, ...form }
    ).then(console.log).catch(console.error);
  };

  const fields = [
    { name:"name", label:"Name", icon: <FaUser /> , type:"text" },
    { name:"age", label:"Age", icon: <FaBirthdayCake /> , type:"number" },
    { name:"height", label:"Height (cm)", icon: <FaRulerVertical />, type:"number" },
    { name:"weight", label:"Weight (kg)", icon: <FaWeightHanging />, type:"number" },
    { name:"gender", label:"Gender", icon: <FaVenusMars />, type:"select", options:["Male","Female"] },
    { name:"email", label:"Email", icon: <FaEnvelope />, type:"email" },
    { name:"activity", label:"Activity Level",icon:<FaDumbbell />, type:"select", 
      options:["1.2","1.375","1.55","1.725","1.9"], 
      optionLabels:["Sedentary","Lightly active","Moderately active","Very active","Super active"]
    }
  ];

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <form onSubmit={handleUpdate} className=" max-w-md w-full p-8 space-y-6">
        {fields.map(f => (
          <div key={f.name} className="relative">
            <span className="absolute left-3 top-3 text-blue-600">{f.icon}</span>
            {f.type === "select" ? (
              <select
                name={f.name}
                value={form[f.name]}
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
              >
                <option value="" disabled>Select {f.label}</option>
                {f.options.map((opt, i) => (
                  <option key={opt} value={opt}>{f.optionLabels? f.optionLabels[i] : opt}</option>
                ))}
              </select>
            ) : (
              <input
                name={f.name}
                type={f.type}
                placeholder={f.label}
                value={form[f.name]}
                required
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
          Save Changes
        </button>
      </form>
    </div>
  );
};