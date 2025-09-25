// src/AuthGate.tsx
import { useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens?.idToken) {
          setSignedIn(true);
          await getCurrentUser().catch(() => {});
          // redirect to /upload or /doctor after login
          navigate("/upload");
        } else {
          setSignedIn(false);
        }
      } catch {
        setSignedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  if (!signedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        <h2>Welcome to TrueVal Project</h2>
        <button
          onClick={() => signInWithRedirect()}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Open Hosted Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
