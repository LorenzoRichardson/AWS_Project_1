// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";

// Load environment variables
const region = import.meta.env.VITE_COGNITO_REGION;
const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolWebClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;

// ⚡ Correct Cognito domain casing
const domain = "us-east-2wRtVXL7e0.auth.us-east-2.amazoncognito.com";

// Your ngrok URL with https and trailing slash
const appUrl = import.meta.env.VITE_APP_URL;

Amplify.configure({
  Auth: {
    region,
    userPoolId,
    userPoolWebClientId,
    oauth: {
      domain,
      scope: ["openid", "email", "profile"],
      redirectSignIn: appUrl,   // Must match your ngrok callback URL exactly
      redirectSignOut: appUrl,  // Same here
      responseType: "code",     // Authorization code grant
    },
  } as any,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
