import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function AppContent({ children }: { children: React.ReactNode }) {
  const [idToken, setIdToken] = useState<string | null>(() => sessionStorage.getItem("idToken"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  function setSession(token: string | null, u: User | null) {
    if (token) sessionStorage.setItem("idToken", token);
    else sessionStorage.removeItem("idToken");
    if (u) sessionStorage.setItem("user", JSON.stringify(u));
    else sessionStorage.removeItem("user");
    setIdToken(token);
    setUser(u);
  }

  useEffect(() => {
    async function hydrate() {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();
        const userInfo = await Auth.currentAuthenticatedUser();
        const attributes = userInfo?.attributes || {};
        const groups = userInfo?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
        const u = { username: userInfo.username, email: attributes.email, groups };
        setSession(token, u);
      } catch {
        // not logged in
      }
    }
    if (!idToken) hydrate();
  }, [idToken]);

  return <AuthContext.Provider value={{ idToken, user, setSession }}>{children}</AuthContext.Provider>;
}

// ProtectedRoute wrapper
function ProtectedRoute({ children, allowedGroups }: { children: React.ReactNode; allowedGroups: string[] }) {
  const { user } = React.useContext(AuthContext);

  if (!user) return <Navigate to="/" />;
  if (!user.groups?.some(g => allowedGroups.includes(g))) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedGroups={["patients"]}>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedGroups={["doctors"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppContent>
    </BrowserRouter>
  );
}
