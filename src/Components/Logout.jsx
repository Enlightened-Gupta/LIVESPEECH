import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Components/layout.scss";
import logo from "../assest/logo.jpeg";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!sessionStorage.getItem("token"); // use sessionStorage for consistency

  // Define routes where only About should show
  const simpleRoutes = ["/login", "/register", "/forgot-password"];
  const onlyAbout = simpleRoutes.includes(location.pathname);

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="main-bg">
      <div className="funky-waves"></div>
      <nav className="funky-navbar">
        <div className="nav-left" onClick={() => navigate("/")}>
          <img src={logo} alt="Ace AI Academy" className="funky-logo" />
        </div>
        <div className="nav-links">
          <Link to="/about">ABOUT</Link>
          {!onlyAbout && isLoggedIn && (
            <>
              <Link to="/profile">PROFILE</Link>
              <Link to="/live">LIVE-SPEECH</Link>
              <button className="nav-btn" onClick={handleLogout}>
                Log Out
              </button>
            </>
          )}
        </div>
      </nav>
      <div className="page-content">{children}</div>
    </div>
  );
}
