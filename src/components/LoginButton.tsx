import { useGoogleLogin } from "@react-oauth/google";
import type { TokenResponse } from "@react-oauth/google";
import Cookies from "js-cookie";

interface LoginButtonProps {
  jwtToken: string;
  setJwtToken: any;
  navigateLists: any;
}

function LoginButton(props: LoginButtonProps) {

  async function getCredentialsFromAccessToken(accessToken: string) {
    try {
        const response = await fetch("http://localhost:7070/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });

        const data = await response.json()
        props.setJwtToken(data.token);
        Cookies.set("jwtToken", data.token);
        props.navigateLists()

      } catch (err) {
        console.error("Login processing failed", err);
      }
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => getCredentialsFromAccessToken(tokenResponse.access_token),
    onError: () => console.error("Login Failed")
  })

  return (
    <button className="w-10 h-10 bg-cyan-900" onClick={() => login()}>
      Lgn
    </button>

  );
}

export default LoginButton;
