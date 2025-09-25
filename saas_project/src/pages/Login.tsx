// pages/Login.tsx
import { useContext, useEffect } from "react";
import { Auth } from "aws-amplify";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setSession } = useContext(AuthContext);
  const navigate = useNavigate();

  // Open Hosted UI
  async function openHostedUI() {
    try {
      await Auth.federatedSignIn();
    } catch (err) {
      console.error("federatedSignIn error", err);
    }
  }

  // Automatically finish login if redirected back from Cognito
  useEffect(() => {
    async function finishLogin() {
      try {
        console.log("Attempting to finish login after redirect...");

        const session = await Auth.currentSession();
        console.log("Session:", session);

        const idToken = session.getIdToken().getJwtToken();
        const userInfo = await Auth.currentAuthenticatedUser();
        console.log("User info:", userInfo);

        const attributes = userInfo?.attributes || {};
        const groups = userInfo?.signInUserSession?.idToken?.payload["cognito:groups"] || [];
        const user = { username: userInfo.username, email: attributes.email, groups };

        setSession(idToken, user);

        // redirect immediately based on group
        if (groups.includes("patients")) {
          navigate("/upload", { replace: true });
        } else if (groups.includes("doctors")) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

      } catch (err) {
        console.error("finishLogin error:", err);
        console.log("Cookies at redirect:", document.cookie);
      }
    }

    finishLogin();
  }, [setSession, navigate]);

  return (
    <div>
      <p>Use the hosted Cognito sign-in page to log in.</p>
      <button onClick={openHostedUI}>Open Hosted Login (Cognito)</button>
      <p style={{ marginTop: 12 }}>
        If redirected back from Cognito, login should finish automatically.
      </p>
    </div>
  );
}
