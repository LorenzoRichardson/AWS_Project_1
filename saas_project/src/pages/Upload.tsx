import { useContext, useState } from "react";
import { AuthContext } from "../App";

export default function Upload() {
  const { session, user } = useContext(AuthContext);
  const idToken = session?.tokens?.idToken?.toString();
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

      // Request presigned PUT URL
      const res = await fetch(`${apiBase}/upload-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          envelopeName: `${Date.now()}_${file.name}`,
          // patientId: user.username // Uncomment if your backend expects it
        }),
      });

      if (!res.ok) throw new Error("failed to get upload url");
      const { uploadUrl, key } = await res.json();
      console.log("Got signed URL for: ", key);

      // PUT file directly to S3 using the presigned URL
      const put = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });
      if (!put.ok) throw new Error("upload failed");

      alert("Upload successful");
    } catch (err) {
      console.error(err);
      alert("Upload error: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          handleFile(f);
        }}
        disabled={uploading}
      />
      {uploading && <div>Uploading…</div>}
      <p style={{ fontSize: 12, color: "#666" }}>
        Files will be uploaded via pre-signed URLs to S3. Make sure your backend `/upload-url`
        endpoint is running and your EC2 role has S3 access.
      </p>
    </div>
  );
}
