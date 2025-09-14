import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-200">
        <Link to="/login">Login</Link>
        <Link to="/upload">Patient Upload</Link>
        <Link to="/dashboard">Doctor Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
