import { useEffect, useState, useContext } from "react";
import { fetchAuthSession, getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./App";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();
  const { setSession, setUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const session = await fetchAuthSession();
        if (session?.tokens?.idToken) {
          setSession(session);
          const user = await getCurrentUser();
          setUser(user);
          setSignedIn(true);

          // Read groups safely (string or array)
          const token: any = session.tokens?.idToken;
          const raw = token?.payload?.["cognito:groups"];
          let groups: string[] = [];
          if (Array.isArray(raw)) groups = raw.map(String);
          else if (typeof raw === "string") groups = [raw];

          // Route by group
          if (groups.includes("doctors")) {
            navigate("/doctor");
          } else if (groups.includes("patients")) {
            navigate("/upload");
          } else {
            navigate("/upload");
          }
        } else {
          setSignedIn(false);
        }
      } catch {
        setSignedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, setSession, setUser]);

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
