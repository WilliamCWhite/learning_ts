import { useGoogleLogin } from "@react-oauth/google";
import type { TokenResponse } from "@react-oauth/google";
import Cookies from "js-cookie";
import Icon from "./Icon";

interface LoginButtonProps {
  jwtToken: string;
  setJwtToken: any;
  navigateLists: any;
}

const API_URL = import.meta.env.VITE_API_URL;

function LoginButton(props: LoginButtonProps) {
  async function getCredentialsFromAccessToken(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      const data = await response.json();
      props.setJwtToken(data.token);
      Cookies.set("jwtToken", data.token);
      props.navigateLists();
    } catch (err) {
      console.error("Login processing failed", err);
    }
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) =>
      getCredentialsFromAccessToken(tokenResponse.access_token),
    onError: () => console.error("Login Failed"),
  });

  return (
    <button
      className="rounded-full my-2 px-12 py-2 gap-2 border-gray-300 border-4 flex justify-center items-center hover:border-blue-200 hover:bg-blue-50 active:border-blue-300 active:bg-blue-100"
      onClick={() => login()}
    >
      <p className="text-lg font-medium text-slate-800">Sign in with</p>
      <Icon iconName="google" classes="w-7 h-7" />
    </button>
  );
}

export default LoginButton;
