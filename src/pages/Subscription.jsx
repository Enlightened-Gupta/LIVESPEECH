// src/pages/Subscription.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../Styles/auth.scss";
import Layout from "../Components/Logout";
import { useNavigate } from "react-router-dom";

// Load from env or hardcode for now
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY); // Set this in your .env

const plans = [
  { value: "monthly", label: "Monthly Plan", price: "$6.99/month", note: "" },
  { value: "yearly", label: "Yearly Plan", price: "$69.99/year", note: "(Save 28%)" },
  { value: "trial", label: "Free Trial", price: "30 days free", note: "cancel anytime" },
];

function SubscriptionForm({ apiUrl, apiKey }) {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const showPaymentForm = selectedPlan === "monthly" || selectedPlan === "yearly";

  async function handleSubscribe(e) {
    e.preventDefault();
    setLoading(true);
    const token = sessionStorage.getItem("token");
    let stripeToken = "";

    if (showPaymentForm) {
      // Create Stripe token from card input
      const cardElement = elements.getElement(CardElement);
      const { token: stripeTokenObj, error } = await stripe.createToken(cardElement, { name });
      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }
      stripeToken = stripeTokenObj.id;
    }

    const subscriptionPayload = {
      name,
      plan: selectedPlan,
      email: "", // Let backend get from JWT
      stripeToken,
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
      {/* Payment fields with Stripe */}
      {showPaymentForm && (
        <div style={{ marginBottom: 18 }}>
          <h5 style={{ margin: "0 0 10px 0", fontWeight: 600 }}>Payment Information</h5>
          <div className="auth-input" style={{ padding: 10, border: "1px solid #eee", borderRadius: 8 }}>
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>
      )}
      <button
        className="auth-btn"
        type="submit"
        disabled={loading || (showPaymentForm && !stripe)}
      >
        {loading ? "Subscribing..." : "Subscribe Now"}
      </button>
    </form>
  );
}

export default function Subscription() {
  // Read from environment (setup your .env file accordingly)
  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  return (
    <Layout>
      <div className="auth-bg">
        <div className="auth-card" style={{ maxWidth: 430 }}>
          <h2 className="auth-title" style={{ marginBottom: 20 }}>Choose Your Subscription</h2>
          <Elements stripe={stripePromise}>
            <SubscriptionForm apiUrl={apiUrl} apiKey={apiKey} />
          </Elements>
        </div>
      </div>
    </Layout>
  );
}
