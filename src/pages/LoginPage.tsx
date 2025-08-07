import Header from "../components/Header.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginButton from "../components/LoginButton.tsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full h-dvh flex flex-col justify-center items-center bg-gray-200">
        <Header signOut={() => props.signOut(navigate)} useSignOut={false} />
        <main className="w-full h-40 grow max-w-2xl flex flex-col items-center bg-gray-100 shadow-xl">
          <section className="w-md px-2 max-w-full h-full flex flex-col justify-center items-center font-rubik text-slate-800">
            <h2 className="text-3xl font-medium py-2">
              Welcome to Tallykeeper!
            </h2>
            <p className="text-lg text-center py-2">
              A simple score-keeping app I made to learn Typescript, Go, React
              Router, Tailwind, and user authentication with JWT Tokens.
            </p>
            <LoginButton
              jwtToken={props.jwtToken}
              setJwtToken={props.setJwtToken}
              navigateLists={() => {
                navigate("/lists");
              }}
            />
            <div className="h-[5%]"></div>
            <p className="text-medium text-center text-gray-500 py-2">
              Icons from{" "}
              <a className="underline" href="https://www.flaticon.com/uicons">
                Flaticon
              </a>
            </p>
            <div className="h-[25%]"></div>
          </section>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginPage;
