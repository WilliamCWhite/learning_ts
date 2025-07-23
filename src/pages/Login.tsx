import Header from "../components/Header.tsx";
import Entry from "../components/Entry.tsx";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import Cookies from "js-cookie";

import "../styles/App.css";

import data from "../assets/test.json";
import { Link } from "react-router-dom";

interface LoginProps {
  jwtToken: string;
  setJwtToken: any;
}

function Login(props: LoginProps) {
  interface Entry {
    name: string;
    score: number;
  }

  const testList: Entry[] = data.lists[0].entries;

  const componentList = testList.map((entry: Entry, index: number) => {
    return <Entry key={index} name={entry.name} score={entry.score} />;
  });

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
      });
  }

  return (
    <GoogleOAuthProvider clientId="934499925133-rfv5i2cqavmutiedelnh1o7tu6l1lvdj.apps.googleusercontent.com">
      <div className="w-screen h-screen flex justify-center items-center bg-white">
        <main className="w-5xl h-full my-16 bg-gray-100">
          <Header />
          <section className="flex flex-col w-full">{componentList}</section>
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
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
