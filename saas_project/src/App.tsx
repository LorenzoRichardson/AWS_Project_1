import { createContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";

interface AuthState {
  session: any;
  user: any;
  idToken?: string;
  setSession: (s: any) => void;
  setUser: (u: any) => void;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  idToken: "",
  setSession: () => {},
  setUser: () => {},
});

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        idToken: session?.tokens?.idToken?.toString() || "",
        setSession,
        setUser,
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/doctor" element={<Dashboard />} />
      </Routes>
    </AuthContext.Provider>
  );
}
