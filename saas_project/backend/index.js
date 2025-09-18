// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize S3 client with your IAM user's credentials from .env
const s3 = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.post("/api/presigned-url", async (req, res) => {
  const { fileName, contentType } = req.body;

  if (!fileName || !contentType) {
    return res.status(400).json({ error: "fileName and contentType required" });
  }

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET, // saas-patient-information
      Key: fileName,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
    res.json({ url, key: fileName });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ error: "Could not generate presigned URL" });
  }
});

// Simple health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

