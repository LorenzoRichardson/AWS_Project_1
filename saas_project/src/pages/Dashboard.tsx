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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Doctor Dashboard</h1>
      <ul className="list-disc pl-6">
        {patients.map((p, idx) => (
          <li key={idx}>
            {p.name} - {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
