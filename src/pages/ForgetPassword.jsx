import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/auth.scss";
import Layout from "../Components/Logout";

const apiUrl = process.env.REACT_APP_API_URL;

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If your backend requires password reset (not just email link), send email, password, confirmPassword
  // Otherwise, if just forgot password, send only email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Check your API docs if this endpoint expects all three fields
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      if (!res.ok) {
        setError("Reset failed. Check details and try again.");
        setLoading(false);
        return;
      }
      setMessage("Password updated successfully! Please login.");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Error updating password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auth-bg">
        <div className="auth-card">
          <h2 className="auth-title">Reset your password</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="New Password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              onChange={e => setConfirmPassword(e.target.value)}
              className="auth-input"
            />
            {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
            {message && <div style={{ color: "green", marginBottom: 8 }}>{message}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <div className="auth-footer">
            <Link to="/login" className="auth-link">Back to login</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
