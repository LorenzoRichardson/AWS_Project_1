import { useState, useContext } from "react";
import { signInWithRedirect, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithRedirect(); // redirects to Cognito Hosted UI
    } catch (err: any) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleFetchSession = async () => {
    try {
      const session = await fetchAuthSession();
      const user = await getCurrentUser();

      if (session?.tokens?.idToken) {
        setSession(session);
        setUser(user);
        navigate("/upload"); // redirect after login success
      } else {
        setError("No valid session found. Try logging in again.");
      }
    } catch {
      setError("Could not fetch session. Try logging in again.");
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
