import React, { useEffect, useRef, useState } from "react";
import Layout from "../Components/Logout";
import { FaUser, FaEnvelope, FaCheckCircle, FaCrown, FaCamera, FaTrashAlt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import "../Styles/profile.scss"
const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef();
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) return;
    setDeleting(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/subscription/delete-account`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
          "x-api-key": apiKey,
        }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        alert("Account deleted successfully.");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert(data.message || data.error || "Failed to delete account.");
      }
    } catch (e) {
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/auth/profile`, {
          headers: {
            "Authorization": "Bearer " + token,
            "x-api-key": apiKey,
          },
        });
        const data = await res.json();
        setUser({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          subscriptionType: data.subscriptionType,
          subscriptionEndDate: data.subscriptionEndDate,
          status: data.status,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only images are allowed!");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfileImg(reader.result);
    reader.readAsDataURL(file);
  }

  const handleCancel = async () => {
    if (!user?.email) return;
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
    setCanceling(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/subscription/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success || (data.message && data.message.toLowerCase().includes("canceled"))) {
        alert("Subscription canceled!");
        window.location.reload();
      } else {
        alert(data.message || data.error || "Failed to cancel subscription.");
      }
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ maxWidth: 500, margin: "4rem auto", textAlign: "center" }}>Loading profile...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div style={{ maxWidth: 500, margin: "4rem auto", textAlign: "center", color: "red" }}>
          Failed to load profile. Please log in again.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-outer-bg">
        <motion.div
          className="profile-card-modern"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
            {profileImg ? (
              <img src={profileImg} alt="Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">
                <FaUser size={52} color="#a259ff" />
                <span className="profile-add-photo"><FaCamera /> Add Photo</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>
          <div className="profile-user-name">{user.name}</div>
          <div className="profile-info-list">
            <ProfileField icon={<FaEnvelope />} label="Email" value={user.email} />
            {user.subscriptionType && (
              <ProfileField
                icon={<FaCrown />}
                label="Subscription"
                value={
                  <>
                    <span className={`sub-pill ${user.subscriptionType}`}>{user.subscriptionType}</span>
                    <span className="profile-expiry"> (Expires: {user.subscriptionEndDate})</span>
                  </>
                }
              />
            )}
            {user.subscriptionType && (
              <ProfileField
                icon={user.status === "active" ? <FaCheckCircle color="#38f9d7" /> : <IoMdCloseCircle color="#d1001f" />}
                label="Status"
                value={
                  <span className={`status-pill ${user.status}`}>
                    {user.status}
                  </span>
                }
              />
            )}
          </div>
          {user.status === "active" && (
            <motion.button
              className="profile-cancel-btn"
              whileTap={{ scale: 0.97 }}
              onClick={handleCancel}
              disabled={canceling}
            >
              {canceling ? "Canceling..." : "Cancel Subscription"}
            </motion.button>
          )}
          <motion.button
            className="profile-delete-btn"
            whileTap={{ scale: 0.97 }}
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{
              background: "#fff",
              color: "#d1001f",
              border: "1.8px solid #fd325c",
              marginTop: 14,
              fontWeight: 700,
              fontSize: 17,
              borderRadius: 14,
              padding: "0.72em 0",
              width: "85%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              boxShadow: "0 2px 9px #fd325c0e",
              transition: "background 0.22s, color 0.22s"
            }}
          >
            <FaTrashAlt />
            {deleting ? "Deleting..." : "Delete Account"}
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="profile-field-row">
      <div className="profile-field-label">{icon} {label}</div>
      <div className="profile-field-value">{value}</div>
    </div>
  );
}
