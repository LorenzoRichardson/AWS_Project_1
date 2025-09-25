import { useContext, useState } from "react";
import { AuthContext } from "../App";

export default function Upload() {
  const { idToken, user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    if (!idToken || !user) {
      alert("Not authenticated");
      return;
    }

    try {
      setUploading(true);
      const apiBase = import.meta.env.VITE_API_URL;

      // 1) Get presigned URL from backend
      const res = await fetch(`${apiBase}/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          envelopeName: `${Date.now()}_${file.name}`,
          patientId: user.username,
        }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadUrl, key } = await res.json();
      console.log("Got signed URL:", key);

      // 2) Upload file to S3
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!put.ok) throw new Error("Upload failed");

      alert("✅ Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload error: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h2>📤 Upload Patient File</h2>
      <input
        type="file"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        disabled={uploading}
        style={{ marginTop: "1rem", padding: "0.5rem" }}
      />
      {uploading && <p>Uploading…</p>}

      <p style={{ fontSize: 12, color: "#666", marginTop: "1rem" }}>
        Files will be securely uploaded to S3 via a presigned URL.
      </p>
    </div>
  );
}
