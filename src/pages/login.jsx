import React, { useState } from "react";
import Layout from "../Components/Logout";
import "../Styles/auth.scss";
import SHA256 from "crypto-js/sha256"; // npm install crypto-js

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Helper to SHA256 hash the password (as backend expects)
  function hashPassword(pw) {
    return SHA256(pw).toString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          Email: email,
          PasswordHash: hashPassword(password)
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        setError(data.message || "Invalid email or password");
        return;
      }
      // Save JWT in sessionStorage
      sessionStorage.setItem("token", data.token);
      window.location.href = "/live";
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="auth-card">
        <h2 className="auth-title">Log In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>
        <div className="auth-footer">
          <span>Don't have an account? <a href="/register">Register</a></span>
        </div>
        <div className="auth-footer">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </Layout>
  );
}
