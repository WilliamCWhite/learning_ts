import Header from "../components/Header.tsx";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import Cookies from "js-cookie";

import "../styles/App.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface LoginProps {
  jwtToken: string;
  setJwtToken: any;
  signOut: (navigate: (path: string) => void) => void;
}

function Login(props: LoginProps) {

  useEffect(() => {
    if (props.jwtToken !== "") {
      navigate("/lists")
    }
  }, [])

  const navigate = useNavigate()


  function testRequest(): void {
    console.log("Initializing testRequest");
    fetch("http://localhost:7070/api/tokentest", {
      method: "GET",
      headers: { Authorization: `Bearer ${props.jwtToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Printing data from testRequest");
        console.log(data);
      });
  }

  function testRequest2(): void {
    console.log("Initializing testRequest2");
    fetch("http://localhost:7070/api/lists", {
      method: "GET",
      headers: { Authorization: `Bearer ${props.jwtToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Printing data from testRequest");
        console.log(data);
      });
  }

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
        navigate("/lists")
      });
  }

  return (
    <GoogleOAuthProvider clientId="934499925133-rfv5i2cqavmutiedelnh1o7tu6l1lvdj.apps.googleusercontent.com">
      <div className="w-screen h-screen flex justify-center items-center bg-white">
        <main className="w-5xl h-full my-16 bg-gray-100">
          <Header signOut={() => props.signOut(navigate)} useSignOut={false}/>
          <GoogleLogin 
            onSuccess={getCredentials}
            onError={() => {
              console.log("Login Failed");
            }}
          />
          <button
            onClick={testRequest2}
            className="w-10 h-10 border-2"
          ></button>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
          <div></div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
