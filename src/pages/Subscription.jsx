import React, { useState } from "react";
import "../Styles/auth.scss"; // Reuse auth styles for layout/card
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Logout";

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const plans = [
  {
    value: "monthly",
    label: "Monthly Plan",
    price: "$6.99/month",
    note: "",
  },
  {
    value: "yearly",
    label: "Yearly Plan",
    price: "$69.99/year",
    note: "(Save 28%)",
  },
  {
    value: "trial",
    label: "Free Trial",
    price: "30 days free",
    note: "cancel anytime",
  },
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Show payment form for paid plans
  const showPaymentForm = selectedPlan === "monthly" || selectedPlan === "yearly";

  function isFormValid() {
    if (!name.trim()) return false;
    if (showPaymentForm) {
      return cardNumber.length >= 12 && exp.length >= 4 && cvc.length >= 3;
    }
    return true;
  }

  async function handleSubscribe(e) {
    e.preventDefault();
    setLoading(true);
    const token = sessionStorage.getItem("token");
    // Compose payload
    const subscriptionPayload = {
      name: name,
      plan: selectedPlan,
      email: "", // backend pulls from JWT, but you can provide it if needed
      stripeToken: showPaymentForm ? "tok_mocked_for_demo" : "", // for demo only, real Stripe needed for prod
    };

    try {
      const res = await fetch(`${apiUrl}/api/subscription/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "x-api-key": apiKey,
        },
        body: JSON.stringify(subscriptionPayload),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);

      // Robust success/error handling
      const message = data.Message || data.message || "";
      if (res.ok && message.toLowerCase().includes("success")) {
        alert(message);
        navigate("/live");
      } else {
        alert(data.Error || data.error || message || "Subscription failed.");
      }
    } catch (err) {
      setLoading(false);
      alert("Subscription failed. Please try again.");
    }
  }

  return (
    <Layout>
      <div className="auth-bg">
        <div className="auth-card" style={{ maxWidth: 430 }}>
          <h2 className="auth-title" style={{ marginBottom: 20 }}>Choose Your Subscription</h2>
          <form className="auth-form" onSubmit={handleSubscribe}>
            {/* Plan selection */}
            <div style={{ marginBottom: 24 }}>
              {plans.map(plan => (
                <div
                  key={plan.value}
                  className={`plan-option-row ${selectedPlan === plan.value ? "selected" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: 12,
                    background: selectedPlan === plan.value ? "#f0fbff" : "transparent",
                    borderRadius: 8,
                    padding: "8px 12px"
                  }}
                  onClick={() => setSelectedPlan(plan.value)}
                >
                  <input
                    type="radio"
                    checked={selectedPlan === plan.value}
                    onChange={() => setSelectedPlan(plan.value)}
                    style={{ marginRight: 14 }}
                    name="plan"
                  />
                  <div>
                    <strong>{plan.label}</strong>{" "}
                    <span style={{ color: "#32B874", fontSize: 13 }}>{plan.note}</span>
                    <div style={{ fontSize: 15, color: "#2C7BE5" }}>{plan.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Name field */}
            <input
              type="text"
              placeholder="Name on Card"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="auth-input"
              style={{ marginBottom: showPaymentForm ? 14 : 24 }}
            />

            {/* Payment fields */}
            {showPaymentForm && (
              <div style={{ marginBottom: 18 }}>
                <h5 style={{ margin: "0 0 10px 0", fontWeight: 600 }}>Payment Information (Mock UI)</h5>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/\D/g, ""))}
                  className="auth-input"
                  maxLength={16}
                  required={showPaymentForm}
                  style={{ marginBottom: 10 }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={exp}
                    onChange={e => setExp(e.target.value)}
                    className="auth-input"
                    maxLength={5}
                    required={showPaymentForm}
                    style={{ width: "55%" }}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g, ""))}
                    className="auth-input"
                    maxLength={4}
                    required={showPaymentForm}
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            )}

            <button
              className="auth-btn"
              type="submit"
              disabled={loading || !isFormValid()}
            >
              {loading ? "Subscribing..." : "Subscribe Now"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
