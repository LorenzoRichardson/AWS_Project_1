// pages/Login.tsx
import { useContext } from "react";
import { Auth } from "aws-amplify";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setSession } = useContext(AuthContext);
  const navigate = useNavigate();

  async function openHostedUI() {
    try {
      // Redirect to Cognito Hosted UI
      Auth.federatedSignIn();
    } catch (err) {
      console.error("federatedSignIn error", err);
    }
  }

  async function finishLogin() {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      const userInfo = await Auth.currentAuthenticatedUser();
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
        navigate("/", { replace: true }); // fallback
      }
    } catch (err) {
      console.error("finishLogin error", err);
      alert("Not logged in yet. Click 'Open Hosted UI' to sign in.");
    }
  }

  return (
    <div>
      <p>Use the hosted Cognito sign-in page to log in.</p>
      <button onClick={openHostedUI}>Open Hosted Login (Cognito)</button>
      <div style={{ marginTop: 12 }}>
        <em>After signing in, you may need to click this to finish the flow:</em>
        <br />
        <button onClick={finishLogin} style={{ marginTop: 8 }}>
          Finish Login (check session)
        </button>
      </div>
    </div>
  );
}
