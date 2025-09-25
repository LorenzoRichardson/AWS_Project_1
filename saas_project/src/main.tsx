// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initAmplify } from "./amplify";
import AuthGate from "./AuthGate";
import App from "./App";

initAmplify();

function UploadDashboard() {
  return <h1 style={{ textAlign: "center", marginTop: "20vh" }}>✅ Upload Dashboard</h1>;
}

function DoctorDashboard() {
  return <h1 style={{ textAlign: "center", marginTop: "20vh" }}>👨‍⚕️ Doctor Dashboard</h1>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthGate>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/upload" element={<UploadDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Routes>
      </AuthGate>
    </BrowserRouter>
  </React.StrictMode>
);
