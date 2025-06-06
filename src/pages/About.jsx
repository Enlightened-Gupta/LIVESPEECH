import React from "react";
import "../Styles/about.scss"; // Place new SCSS in same folder
import Layout from "../Components/Logout";
export default function About() {
  return (
    <Layout>
    <div className="about-bg">
      <div className="waves"></div>
      <div className="about-card">
        <h2 className="about-title">
          <span>Introducing</span>
          <span className="brand-gradient"> Ace AI Academy for Medical</span>
        </h2>
        <p className="about-subtitle">Your Voice-Activated Medical Assistant</p>
        <div className="about-features">
          <div className="about-feature">
            <span className="icon">🎤</span>
            <div>
              <strong>Ask by Voice</strong>
              <p>
                Skip the typing. Just speak your medical question and get instant, accurate answers with our voice-enabled assistant.
              </p>
            </div>
          </div>
          <div className="about-feature">
            <span className="icon">🛡️</span>
            <div>
              <strong>Trusted Sources Only</strong>
              <p>
                MedAI pulls data strictly from verified sources like the <span className="highlight">CDC</span> and <span className="highlight">FDA</span>, ensuring you're guided by reliable, up-to-date medical knowledge.
              </p>
            </div>
          </div>
          <div className="about-feature">
            <span className="icon">⚡</span>
            <div>
              <strong>Fast & Reliable</strong>
              <p>
                Whether you're on rounds, in class, or reviewing during a shift, MedAI provides clear, concise, and actionable insights—fast.
              </p>
            </div>
          </div>
        </div>
        <div className="about-footer">
          <p>
            Ace AI Academy is committed to empowering learners and professionals through cutting-edge AI tools and educational resources.
            <br />
            <span>Contact our support team at <a href="mailto:support@aceaiacademy.com">support@aceaiacademy.com</a></span>
          </p>
          <p className="closing">
            <span className="brand-gradient bold">No fluff. Just facts. From sources you trust.</span>
          </p>
        </div>
      </div>
    </div>
    </Layout>
  );
}
