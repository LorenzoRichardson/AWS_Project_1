import React, { useState, useContext } from "react";
import { signInWithRedirect, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // Redirect user to Cognito Hosted UI
      await signInWithRedirect();
    } catch (err: any) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  // Called when redirected back from Cognito
  const handleFetchSession = async () => {
    try {
      const session = await fetchAuthSession();
      const user = await getCurrentUser();
      if (session?.tokens?.idToken) {
        setSession(session);
        navigate("/upload"); // redirect after login success
      }
    } catch {
      setError("Could not fetch session.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        {loading ? "Redirecting..." : "Open Hosted Login"}
      </button>

      <div>
        <button
          onClick={handleFetchSession}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Fetch Session (After Login)
        </button>
      </div>
    </div>
  );
}
