import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

interface AuthState {
  session: any;
  user: any;
  setSession: (s: any) => void;
  setUser: (u: any) => void;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  setSession: () => {},
  setUser: () => {},
});

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ session, user, setSession, setUser }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/upload"
          element={
            <div style={{ textAlign: "center", marginTop: "20vh" }}>
              <h1>✅ Upload Dashboard</h1>
              <p>Welcome! You are signed in.</p>
            </div>
          }
        />
        <Route
          path="/doctor"
          element={
            <div style={{ textAlign: "center", marginTop: "20vh" }}>
              <h1>👨‍⚕️ Doctor Dashboard</h1>
              <p>Welcome! You are signed in.</p>
            </div>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}
