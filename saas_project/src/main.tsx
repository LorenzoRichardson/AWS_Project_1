// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Amplify } from "aws-amplify";

const region = import.meta.env.VITE_COGNITO_REGION;
const userPoolId = import.meta.env.VITE_USER_POOL_ID;
const userPoolWebClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;
const appUrl = import.meta.env.VITE_APP_URL;

Amplify.configure({
  Auth: {
    region,
    userPoolId,
    userPoolWebClientId,
    oauth: {
      domain,
      scope: ["openid", "email", "profile"],
      redirectSignIn: appUrl,
      redirectSignOut: appUrl,
      responseType: "code", // authorization code grant
    },
  } as any,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
