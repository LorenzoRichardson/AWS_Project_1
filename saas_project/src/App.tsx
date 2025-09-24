// App.tsx
import React, { useEffect, useState } from "react";
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

export default function App() {
  const [idToken, setIdToken] = useState<string | null>(() => sessionStorage.getItem("idToken"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // If we have no token but Amplify can find a session after redirect, hydrate it.
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
      } catch {
        // not logged in — that's fine
      }
    }
    if (!idToken) tryHydrate();
  }, []);

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
          <>
            <div style={{ marginBottom: 12 }}>
              <strong>Signed in as:</strong> {user?.email ?? user?.username}{" "}
              <button
                onClick={async () => {
                  await Auth.signOut();
                  setSession(null, null);
                }}
              >
                Sign out
              </button>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h3>Upload (Patient)</h3>
                <Upload />
              </div>
              <div style={{ flex: 1 }}>
                <h3>Dashboard (Doctor / Patient)</h3>
                <Dashboard />
              </div>
            </div>
          </>
        )}
      </div>
    </AuthContext.Provider>
  );
}
