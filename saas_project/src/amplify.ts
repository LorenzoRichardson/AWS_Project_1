// src/amplify.ts
import { Amplify } from "aws-amplify";

const userPoolId = import.meta.env.VITE_USER_POOL_ID as string;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID as string;
const domain = import.meta.env.VITE_COGNITO_DOMAIN as string;
const appUrl = import.meta.env.VITE_APP_URL as string; // e.g. "https://truevalproject.xyz/"

export function initAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          oauth: {
            domain,
            scopes: ["openid", "email", "profile"],
            redirectSignIn: [appUrl],
            redirectSignOut: [appUrl],
            responseType: "code",
          },
        },
      },
    },
  });
}
