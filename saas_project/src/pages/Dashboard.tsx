import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }

    // TEMP: Mock patients
    setPatients([
      { name: "Patient A", status: "Uploaded form" },
      { name: "Patient B", status: "Uploaded lab results" },
    ]);
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <ul className="space-y-2">
        {patients.map((p, idx) => (
          <li
            key={idx}
            className="border rounded-md p-3 flex justify-between items-center"
          >
            <span className="font-medium">{p.name}</span>
            <span className="text-sm text-gray-500">{p.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
