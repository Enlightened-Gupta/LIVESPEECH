import React, { useRef, useState } from "react";
import Layout from "../Components/Logout";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const apiUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

export default function LivePage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const recognitionRef = useRef(null);
  const manuallyStopped = useRef(false);
  const fullTranscript = useRef(""); // stores all recognized text

  // Start/stop speech recognition
  const handleMicClick = () => {
    if (!recording) {
      setTranscript("");
      setAnswer("");
      setLoading(false);
      manuallyStopped.current = false;
      fullTranscript.current = "";

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser does not support real-time speech recognition.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true; // try to keep listening, but browser may still timeout after ~10s silence
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = event => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            fullTranscript.current += text + " ";
          } else {
            interim += text;
          }
        }
        setTranscript(fullTranscript.current + interim);
      };

      recognition.onend = () => {
        // If the user did NOT tap stop, auto-restart for long sessions
        if (!manuallyStopped.current) {
          recognition.start();
        } else {
          setRecording(false);
          if (fullTranscript.current.trim()) handleShowAnswer(fullTranscript.current.trim());
        }
      };

      recognition.start();
      setRecording(true);
    } else {
      // User taps to stop
      manuallyStopped.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setRecording(false);
      }
    }
  };

  // Get answer from backend
  const handleShowAnswer = async (inputTranscript) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const textToSend = (typeof inputTranscript === "string" ? inputTranscript : transcript).trim();
      const res = await fetch(`${apiUrl}/api/speech/chatgpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ transcript: textToSend }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.Answer || "");
    } catch {
      setAnswer("Failed to get answer.");
    }
    setLoading(false);
  };

  // Two-column layout
  return (
    <Layout>
      <div className="live-two-col-bg">
        <div className="live-two-col-container">
          {/* Left - Question */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            className="live-question-pane"
          >
            <h2 className="live-title">Live Speech Recognition</h2>
            <motion.button
              whileTap={{ scale: 0.96 }}
              animate={recording ? { boxShadow: "0 0 0 14px #c5a2fe55" } : { boxShadow: "0 2px 8px #8f9bfe33" }}
              className="live-mic-btn"
              title={recording ? "Tap to stop & get answer" : "Tap to start recording"}
              disabled={loading}
              onClick={handleMicClick}
              style={{
                marginBottom: 12,
              }}
            >
              {recording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </motion.button>
            <div style={{ marginBottom: 12, color: "#232ed1" }}>
              {recording ? "Listening... Tap to stop." : "Tap mic or type your question."}
            </div>
            <label className="live-label">Transcript:</label>
            <textarea
              className="live-transcript"
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Type or use mic to ask your question..."
              rows={5}
              disabled={recording || loading}
              style={{ marginBottom: 20 }}
            />
            {!recording && (
              <motion.button
                className="live-get-btn"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShowAnswer(transcript)}
                disabled={loading || !transcript.trim()}
              >
                {loading ? <span className="dot-pulse" style={{ marginRight: 8 }} /> : null}
                {loading ? "Getting Answer..." : "Get Answer"}
              </motion.button>
            )}
          </motion.div>
          {/* Right - Answer */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            className="live-answer-pane"
          >
            <label className="live-label">Answer:</label>
            <div className="live-answer-box">
              {answer
                ? <span style={{ whiteSpace: "pre-line", fontSize: 19, color: "#272e3d" }}>{answer}</span>
                : <span style={{ color: "#babbd6" }}>The answer will appear here.</span>
              }
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .live-two-col-bg {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(120deg, #a259ff 0%, #6e45e2 50%, #38f9d7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .live-two-col-container {
          width: 97vw;
          max-width: 1250px;
          min-height: 66vh;
          margin: 2.3rem 0;
          background: #fff;
          border-radius: 28px;
          box-shadow: 0 8px 36px #b497fd15;
          display: flex;
          gap: 0px;
          overflow: hidden;
        }
        .live-question-pane, .live-answer-pane {
          flex: 1 1 0;
          padding: 2.8rem 2.7rem 2.2rem 2.7rem;
          display: flex;
          flex-direction: column;
        }
        .live-question-pane {
          border-right: 1.5px solid #edeaff;
        }
        .live-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #232ed1;
          margin-bottom: 18px;
        }
        .live-mic-btn {
          background: #232ed1;
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 74px;
          height: 74px;
          font-size: 36px;
          outline: none;
          cursor: pointer;
          margin-bottom: 10px;
          transition: background 0.28s, box-shadow 0.22s;
          box-shadow: 0 2px 8px #c5a2fe2a;
        }
        .live-label {
          font-weight: 700;
          color: #232ed1;
          font-size: 1.13rem;
          margin-bottom: 6px;
        }
        .live-transcript {
          width: 100%;
          border-radius: 13px;
          border: 1.5px solid #e3e3fc;
          background: #f8faff;
          font-size: 18px;
          padding: 13px 17px;
          resize: vertical;
          min-height: 66px;
          max-height: 160px;
          outline: none;
        }
        .live-get-btn {
          width: 100%;
          margin-top: 9px;
          font-size: 20px;
          font-weight: 700;
          padding: 15px 0;
          border-radius: 15px;
          background: linear-gradient(90deg,#73facf 0%, #53b7fd 80%, #b497fd 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 12px #c9cffe2a;
          letter-spacing: 1.2;
          cursor: pointer;
          transition: background 0.22s, box-shadow 0.18s;
        }
        .live-answer-pane {
          background: #f9f8ff;
          display: flex;
          flex-direction: column;
        }
        .live-answer-box {
          background: #fff;
          border-radius: 18px;
          border: 1.5px solid #e3e3fc;
          box-shadow: 0 2px 10px #b497fd15;
          margin-top: 11px;
          padding: 28px 22px 24px 22px;
          font-size: 19px;
          min-height: 420px;
          max-height: 600px;
          overflow-y: auto;
        }
        .dot-pulse {
          display: inline-block;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 0 #fff8, 0 0 0 8px #b497fd44;
          animation: pulse-dot 1s infinite;
        }
        @keyframes pulse-dot {
          0% { box-shadow: 0 0 0 0 #fff8, 0 0 0 0 #b497fd44;}
          50% { box-shadow: 0 0 0 6px #fff8, 0 0 0 12px #c5a2fe44;}
          100% { box-shadow: 0 0 0 0 #fff8, 0 0 0 0 #b497fd44;}
        }
        @media (max-width: 900px) {
          .live-two-col-container { flex-direction: column; max-width: 99vw; }
          .live-question-pane, .live-answer-pane { border-right: none; padding: 1.4rem 1.1rem; }
        }
      `}</style>
    </Layout>
  );
}
