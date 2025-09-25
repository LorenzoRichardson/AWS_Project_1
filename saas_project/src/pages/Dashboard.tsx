import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

type FileItem = {
  patientId?: string;
  fileId: string;
  originalName?: string;
  uploadDate?: string;
};

export default function Dashboard() {
  const { idToken, user } = useContext(AuthContext);
  const [patientId, setPatientId] = useState<string>(user?.username ?? "");
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function listFiles(forPatient: string) {
    if (!idToken) {
      alert("Not authenticated");
      return;
    }
    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBase}/files/${encodeURIComponent(forPatient)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("list failed");
      const data = await res.json();
      setItems(data.items ?? data);
    } catch (err) {
      console.error(err);
      alert("List error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function download(key: string) {
    if (!idToken) {
      alert("Not authenticated");
      return;
    }
    try {
      const apiBase = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiBase}/download-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) throw new Error("download-url failed");
      const { downloadUrl } = await res.json();
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("download error: " + (err as Error).message);
    }
  }

  useEffect(() => {
    if (patientId) listFiles(patientId);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📂 Doctor Dashboard</h2>
      <label>
        Patient ID:{" "}
        <input
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{ marginRight: "1rem" }}
        />
      </label>
      <button onClick={() => listFiles(patientId)}>🔍 Load Files</button>

      {loading ? (
        <p>Loading files…</p>
      ) : items.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>File</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Uploaded</th>
              <th style={{ padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.fileId}>
                <td style={{ padding: "0.5rem" }}>{it.originalName ?? it.fileId}</td>
                <td style={{ padding: "0.5rem" }}>{it.uploadDate ?? "-"}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button onClick={() => download(it.fileId)}>⬇️ Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
