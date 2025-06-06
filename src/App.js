import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./Components/ProtectedRoute";
import Live from "./pages/Live"; // Dummy page
import "./Styles/auth.scss";
import Subscription from "./pages/Subscription";
import About from "./pages/About";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/subscribe" element={<Subscription/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/live" element={<Live />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
