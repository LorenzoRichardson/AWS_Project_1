// App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import { Auth } from "aws-amplify";

type User = {
  username: string;
  email?: string;
  groups?: string[];
};

export const AuthContext = React.createContext<{
  idToken: string | null;
  user: User | null;
  setSession: (idToken: string | null, user: User | null) => void;
}>({
  idToken: null,
  user: null,
  setSession: () => {},
});

function AppContent() {
  const [idToken, setIdToken] = useState<string | null>(() => sessionStorage.getItem("idToken"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function tryHydrate() {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();
        const userInfo = await Auth.currentAuthenticatedUser();
        const attributes = userInfo?.attributes || {};
        const groups = userInfo?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
        const u = { username: userInfo.username, email: attributes.email, groups };

        sessionStorage.setItem("idToken", token);
        sessionStorage.setItem("user", JSON.stringify(u));
        setIdToken(token);
        setUser(u);

        // redirect based on group
        if (groups.includes("patients")) navigate("/upload", { replace: true });
        if (groups.includes("doctors")) navigate("/dashboard", { replace: true });
      } catch {
        // not logged in
      }
    }
    if (!idToken) tryHydrate();
  }, [idToken, navigate]);

  function setSession(token: string | null, u: User | null) {
    if (token) sessionStorage.setItem("idToken", token);
    else sessionStorage.removeItem("idToken");
    if (u) sessionStorage.setItem("user", JSON.stringify(u));
    else sessionStorage.removeItem("user");
    setIdToken(token);
    setUser(u);
  }

  return (
    <AuthContext.Provider value={{ idToken, user, setSession }}>
      <div style={{ padding: 20 }}>
        <h2>HIPAA Demo App (School Project)</h2>

        {!idToken ? (
          <Login />
        ) : (
          <div style={{ marginBottom: 12 }}>
            <strong>Signed in as:</strong> {user?.email ?? user?.username}{" "}
            <button
              onClick={async () => {
                await Auth.signOut();
                setSession(null, null);
                navigate("/", { replace: true });
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app logic */}
        <Route path="/" element={<AppContent />} />

        {/* Protected routes (you can add wrappers later if needed) */}
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all: send back to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
