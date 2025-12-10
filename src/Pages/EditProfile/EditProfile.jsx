import { useEffect, useState } from "react";
import { FaUser, FaBirthdayCake, FaRulerVertical, FaWeightHanging, FaVenusMars, FaEnvelope, FaDumbbell } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import API from "../../Components/api";
import { Snackbar, Alert } from "@mui/material";
import LoadingSpinner from "../../Components/ui/LoadingSpinner";
import "./editprofile.css";

export const EditProfile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [form, setForm] = useState({ name: "", age: "", height: "", weight: "", gender: "", email: "", activity: "" });
  const [openalert, setOpenalert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClosealert = () => setOpenalert(false);
  const handleOpenalert = () => setOpenalert(true);

  useEffect(() => {
    API.get('/verify')
      .then(res => {
        const userEmail = res.data.user.email;
        setForm(prev => ({
          ...prev,
          email: userEmail
        }))
        return API.get("/getProfile", { params: { email: userEmail } })

      }).then(res => {
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
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = e => {
    e.preventDefault();
    setLoading(true);
    API.patch(`/updateProfile/${userProfile._id}`,
      { ...userProfile, ...form }
    ).then(() => {
      setLoading(false);
      handleOpenalert();
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const fields = [
    { name: "name", label: "Name", icon: <FaUser />, type: "text" },
    { name: "age", label: "Age", icon: <FaBirthdayCake />, type: "number" },
    { name: "height", label: "Height (cm)", icon: <FaRulerVertical />, type: "number" },
    { name: "weight", label: "Weight (kg)", icon: <FaWeightHanging />, type: "number" },
    { name: "gender", label: "Gender", icon: <FaVenusMars />, type: "select", options: ["Male", "Female"] },
    { name: "email", label: "Email", icon: <FaEnvelope />, type: "email" },
    {
      name: "activity", label: "Activity Level", icon: <FaDumbbell />, type: "select",
      options: ["1.2", "1.375", "1.55", "1.725", "1.9"],
      optionLabels: ["Sedentary (Little or no exercise)", "Lightly active (1-3 days/week)", "Moderately active (3-5 days/week)", "Very active (6-7 days/week)", "Super active (Athlete level)"]
    }
  ];

  return (
    <div className="editprofile-container">
      <div className="editprofile-card">
        <div className="editprofile-header">
          <h1 className="editprofile-title">Edit Profile</h1>
          <p className="editprofile-subtitle">Update your health information</p>
        </div>

        <form onSubmit={handleUpdate} className="editprofile-form">
          <div className="editprofile-grid">
            {fields.map(f => (
              <div key={f.name} className={`form-group ${f.name === 'email' || f.name === 'activity' ? 'editprofile-grid-full' : ''}`}>
                <label htmlFor={f.name} className="form-label">{f.label}</label>
                {f.type === "select" ? (
                  <select
                    id={f.name}
                    name={f.name}
                    value={form[f.name]}
                    required
                    onChange={handleChange}
                    className="form-select"
                  >
                    {f.options.map((opt, i) => (
                      <option key={opt} value={opt}>{f.optionLabels ? f.optionLabels[i] : opt}</option>
                    ))}
                  </select>
                ) : (
                  <div className="input-with-icon">
                    {f.icon && <span className="input-icon">{f.icon}</span>}
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type}
                      value={form[f.name]}
                      required
                      onChange={handleChange}
                      className="form-input"
                      disabled={f.name === 'email'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn-submit gradient-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>

      <Snackbar
        open={openalert}
        autoHideDuration={3000}
        onClose={handleClosealert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClosealert} severity="success" sx={{ width: '100%' }}>
           Profile Updated Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};