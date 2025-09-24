// server.js (ES Module, Express 5 compatible)
import express from "express";
import AWS from "aws-sdk";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Needed to replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// AWS setup
AWS.config.update({ region: "us-east-2" });
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();

const BUCKET_NAME = "myapp-trueval-lr-cs360";
const TABLE_NAME = "PatientFiles";

// --- API ROUTES ---

// POST /upload-url
app.post("/upload-url", async (req, res) => {
  try {
    const { envelopeName, patientId } = req.body;
    if (!envelopeName) return res.status(400).json({ error: "Missing envelopeName" });

    const key = `${patientId || "unknown"}/${Date.now()}_${envelopeName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: 300,
      ContentType: "application/octet-stream",
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    await ddb
      .put({
        TableName: TABLE_NAME,
        Item: {
          patientId: patientId || "unknown",
          fileId: key,
          originalName: envelopeName,
          uploadDate: new Date().toISOString(),
        },
      })
      .promise();

    res.json({ uploadUrl, key });
  } catch (err) {
    console.error("upload-url error", err);
    res.status(500).json({ error: "Could not create upload URL" });
  }
});

// GET /files/:patientId
app.get("/files/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ error: "Missing patientId" });

    const result = await ddb
      .query({
        TableName: TABLE_NAME,
        KeyConditionExpression: "patientId = :pid",
        ExpressionAttributeValues: { ":pid": patientId },
      })
      .promise();

    res.json({ items: result.Items || [] });
  } catch (err) {
    console.error("files error", err);
    res.status(500).json({ error: "Could not list files" });
  }
});

// POST /download-url
app.post("/download-url", async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Missing key" });

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: 300,
    };

    const downloadUrl = await s3.getSignedUrlPromise("getObject", params);
    res.json({ downloadUrl });
  } catch (err) {
    console.error("download-url error", err);
    res.status(500).json({ error: "Could not create download URL" });
  }
});

// --- FRONTEND ROUTES ---

// Serve React build files
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all for React SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
