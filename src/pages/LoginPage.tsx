import Header from "../components/Header.tsx";
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import type { CredentialResponse, TokenResponse } from "@react-oauth/google";
import Cookies from "js-cookie";

import "../styles/App.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginButton from "../components/LoginButton.tsx";

interface LoginPageProps {
  jwtToken: string;
  setJwtToken: any;
  signOut: (navigate: (path: string) => void) => void;
}

function LoginPage(props: LoginPageProps) {
  useEffect(() => {
    if (props.jwtToken !== "") {
      navigate("/lists");
    }
  }, []);

  const navigate = useNavigate();


  function getCredentials(credentialResponse: CredentialResponse) {
    console.log(credentialResponse);
    const idToken = credentialResponse.credential;
    fetch("http://localhost:7070/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Writing post request response below");
        console.log(data);
        props.setJwtToken(data.token);
        Cookies.set("jwtToken", data.token);
        navigate("/lists");
      });
  }

  async function getCredentialsFromAccessToken(accessToken: string) {
    try {
        const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
        const authData = await res.json();

        if (authData.error || !authData.email) {
          throw new Error("Failed to verify access token");
        }

        const idToken = authData.id_token;
        if (!idToken) {
          throw new Error("ID token not found in tokeninfo response");
        }

        const response = await fetch("http://localhost:7070/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        const data = await response.json()
        props.setJwtToken(data.token);
        Cookies.set("jwtToken", data.token);
        navigate("/lists")

      } catch (err) {
        console.error("Login processing failed", err);
      }
  }

  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse: TokenResponse) => getCredentialsFromAccessToken(tokenResponse.access_token),
  //   onError: () => console.error("Login Failed")
  // })

  return (
    <GoogleOAuthProvider clientId="934499925133-rfv5i2cqavmutiedelnh1o7tu6l1lvdj.apps.googleusercontent.com">
      <div className="w-screen h-screen flex flex-col justify-center items-center bg-gray-200">
        <Header signOut={() => props.signOut(navigate)} useSignOut={false} />
        <main className="w-full h-40 grow max-w-2xl flex flex-col items-center bg-gray-100 shadow-xl">
          <GoogleLogin
            onSuccess={getCredentials}
            onError={() => {
              console.log("Login Failed");
            }}
          />
          {/* <button className="border-2 w-15 h-10 bg-cyan-900" onClick={() => login()}></button> */}
          <LoginButton jwtToken={props.jwtToken} setJwtToken={props.setJwtToken} navigateLists={() => {navigate("/lists")}} />
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
