import { Routes, Route } from "react-router-dom";
import { Login } from "../Pages/Login/Login";
import { Signup } from "../Pages/Signup/Signup";
import { Profile } from "../Pages/Profile";
import { Home } from "../Pages/Home";
import { PrivateRoute } from "./PrivateRoute";
import { EditProfile } from "../Pages/EditProfile/EditProfile";

export const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
    </Routes>
  );
}