import { Routes, Route, useNavigate } from "react-router-dom";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import { useEffect, useState } from "react";
import TestDashboard from "./pages/TestDashboard.tsx";
import Cookies from "js-cookie";
import ListPage from "./pages/ListPage.tsx";

function App() {
  const [jwtToken, setJwtToken] = useState<string>(() => {
    const cookieJwt = Cookies.get("jwtToken");
    if (cookieJwt === undefined) {
      return "";
    }
    return cookieJwt;
  });

  const navigate = useNavigate();

  function handleJwtFailure(
    statusCode: number,
    navigate: (path: string) => void,
  ) {
    if (statusCode !== 401 && statusCode !== 403) {
      return;
    }

    setJwtToken("");
    Cookies.set("jwtToken", "");
    navigate("/login");
    throw new Error("unauthorized");
  }

  function signOut(navigate: (path: string) => void) {
    setJwtToken("");
    Cookies.set("jwtToken", "");
    navigate("/login");
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<Login jwtToken={jwtToken} setJwtToken={setJwtToken} />}
        />
        <Route
          path="/"
          element={<Login jwtToken={jwtToken} setJwtToken={setJwtToken} />}
        />
        <Route
          path="/dashboard"
          element={
            <TestDashboard
              jwtToken={jwtToken}
              setJwtToken={setJwtToken}
              handleJwtFailure={handleJwtFailure}
              signOut={signOut}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/lists"
          element={
            <ListPage jwtToken={jwtToken} handleJwtFailure={handleJwtFailure} signOut={signOut}/>
          }
        />
      </Routes>
    </>
  );
}

export default App;
