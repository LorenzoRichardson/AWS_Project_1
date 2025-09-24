// pages/Dashboard.tsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";

type FileItem = {
  patientId?: string;
  fileId: string; // S3 key (we will use as id)
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
      // Expect { items: [...] } or array
      const arr: FileItem[] = data.items ?? data;
      setItems(arr);
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
      // open in new tab
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
    <div>
      <div style={{ marginBottom: 8 }}>
        <label>
          Patient ID (username):{" "}
          <input value={patientId} onChange={(e) => setPatientId(e.target.value)} />
        </label>
        <button onClick={() => listFiles(patientId)} style={{ marginLeft: 8 }}>
          List files
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div>No files found</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 6 }}>File</th>
              <th style={{ textAlign: "left", padding: 6 }}>Uploaded</th>
              <th style={{ padding: 6 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.fileId}>
                <td style={{ padding: 6 }}>{it.originalName ?? it.fileId}</td>
                <td style={{ padding: 6 }}>{it.uploadDate ?? "-"}</td>
                <td style={{ padding: 6 }}>
                  <button onClick={() => download(it.fileId)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
