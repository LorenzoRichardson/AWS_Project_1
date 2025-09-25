import React, { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";


export const AuthContext = createContext<{ setSession: (s: any) => void }>({
  setSession: () => {},
});

export default function App() {
  const [session, setSession] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ setSession }}>
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
