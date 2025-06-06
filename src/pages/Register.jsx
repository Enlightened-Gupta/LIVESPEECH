import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/auth.scss";
import Layout from "../Components/Logout";
import SHA256 from "crypto-js/sha256"; // npm install crypto-js

const apiUrl = process.env.REACT_APP_API_URL;
export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "",
    password: "", confirmPassword: "", city: "", state: "", country: "", isAgreed: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!form.isAgreed) {
      alert("You must agree to the terms.");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        FirstName: form.firstName,
        LastName: form.lastName,
        Email: form.email,
        PhoneNumber: form.phoneNumber,
        PasswordHash: SHA256(form.password).toString(),
        IsAgreed: true,
        Role: "User",
        AddressLine1: "",
        City: form.city,
        State: form.state,
        PostalCode: "",
        Country: form.country
      };
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.REACT_APP_API_KEY },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      setLoading(true);
      const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.REACT_APP_API_KEY },
        body: JSON.stringify({
          Email: form.email,
          PasswordHash: SHA256(form.password).toString(),
        }),
      });
      const loginData = await loginRes.json().catch(() => ({}));
      setLoading(false);

      if (loginRes.ok && loginData.token) {
        sessionStorage.setItem("token", loginData.token);
        window.location.href = "/subscribe";
      } else {
        alert("Registration succeeded. Please log in manually.");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      alert("Registration failed. Please try again.");
    }
  }

  return (
    <Layout>
      <div className="auth-bg">
        <div className="auth-card" style={{ maxWidth: 520 }}>
          <div className="auth-title" style={{ marginBottom: 18 }}>Create your account</div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-row">
              <div className="auth-label-wrap">
                <label>First Name <span className="req">*</span></label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="auth-label-wrap">
                <label>Last Name <span className="req">*</span></label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="auth-form-row">
              <div className="auth-label-wrap">
                <label>Email <span className="req">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="auth-label-wrap">
                <label>Mobile <span className="opt">(optional)</span></label>
                <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
              </div>
            </div>
            <div className="auth-form-row">
              <div className="auth-label-wrap">
                <label>Password <span className="req">*</span></label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="auth-label-wrap">
                <label>Confirm Password <span className="req">*</span></label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <div className="auth-form-row">
              <div className="auth-label-wrap">
                <label>City <span className="opt">(optional)</span></label>
                <input type="text" name="city" value={form.city} onChange={handleChange} />
              </div>
              <div className="auth-label-wrap">
                <label>State <span className="opt">(optional)</span></label>
                <input type="text" name="state" value={form.state} onChange={handleChange} />
              </div>
            </div>
            <div className="auth-form-row">
              <div className="auth-label-wrap" style={{ width: "100%" }}>
                <label>Country <span className="opt">(optional)</span></label>
                <input type="text" name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>
            <label className="auth-checkbox-label" style={{ marginTop: 8, marginBottom: 18 }}>
              <input type="checkbox" name="isAgreed" checked={form.isAgreed} onChange={handleChange} required />
              I understand that Med.AceAIAcademy is for informational purposes only and not a substitute for professional medical advice.
            </label>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="auth-link-row" style={{ marginTop: 14 }}>
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </div>
        </div>
      </div>
      <style>{`
        .auth-label-wrap {
          display: flex;
          flex-direction: column;
          flex: 1 1 0;
          margin-right: 10px;
        }
        .auth-label-wrap label {
          font-weight: 600;
          font-size: 1.03rem;
          margin-bottom: 2px;
        }
        .req { color: #e32c39; font-weight: bold; }
        .opt { color: #888; font-size: 0.93em; font-weight: 500; margin-left: 2px; }
      `}</style>
    </Layout>
  );
}
