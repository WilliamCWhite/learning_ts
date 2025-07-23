import { Routes, Route, useNavigate } from "react-router-dom";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import { useEffect, useState } from "react";
import TestDashboard from "./pages/TestDashboard.tsx";
import Cookies from "js-cookie"

function App() {
  const [jwtToken, setJwtToken] = useState<string>("");
  const navigate = useNavigate()

  useEffect(() => {
    const cookieJwt = Cookies.get("jwtToken")
    if (cookieJwt !== undefined && cookieJwt !== "") {
      setJwtToken(cookieJwt)
      navigate("/dashboard")
    }
    else {
      navigate("/login")
    }
  }, [])

  function handleJwtFailure(
    statusCode: number,
    navigate: (path: string) => void,
  ) {
    if (statusCode !== 401 && statusCode !== 403) {
      return;
    }

    setJwtToken("");
    Cookies.set("jwtToken", "")
    navigate("/login");
    throw new Error("unauthorized");
  }

  function SignOut(navigate: (path: string) => void) {
    setJwtToken("")
    Cookies.set("jwtToken", "")
    navigate("/login")
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<Login jwtToken={jwtToken} setJwtToken={setJwtToken} />}
        />
        <Route
          path="/dashboard"
          element={
            <TestDashboard
              jwtToken={jwtToken}
              setJwtToken={setJwtToken}
              handleJwtFailure={handleJwtFailure}
              SignOut={SignOut}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
