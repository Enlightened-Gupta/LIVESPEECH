import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/navbar.scss";
import logo from "../assest/logo.jpeg"; // Adjust path if needed

export default function NavBar({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="nav-main">
      <div className="nav-content">
        <div className="nav-logo" onClick={() => navigate("/live")}>
          <img src={logo} alt="Ace AI Academy" />
        </div>
        <div className="nav-center-title">
          Ace Academy
        </div>
        <div className="nav-links">
        <Link to="/about" className="nav-link">About</Link>
          {isAuthenticated && <Link to="/live">Live Speech</Link>}
          {isAuthenticated && userRole === "Admin" && (
            <Link to="/register">Register</Link>
          )}
          {!isAuthenticated && <Link to="/login">Log In</Link>}
          {isAuthenticated && <Link to="/profile">Profile</Link>}
          {isAuthenticated && (
            <button className="nav-logout" onClick={onLogout}>
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
