import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ListPage from "./pages/ListPage.tsx";
import EntryPage from "./pages/EntryPage.tsx";

function App() {
  const [jwtToken, setJwtToken] = useState<string>(() => {
    const cookieJwt = Cookies.get("jwtToken");
    if (cookieJwt === undefined) {
      return "";
    }
    return cookieJwt;
  });
  const [selectedListID, setSelectedListID] = useState<number>(-1);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(selectedListID)
    if (selectedListID !== -1) {
      navigate("/entries");
    }
    else {
      if (jwtToken !== "") {
        navigate("/lists")
      }
      else {
        navigate("/login")
      }
    }
  }, [selectedListID]);

  function handleJwtFailure(
    statusCode: number,
    navigate: (path: string) => void,
  ) {
    if (statusCode !== 401 && statusCode !== 403) {
      return;
    }

    setJwtToken("");
    Cookies.set("jwtToken", "");
    setSelectedListID(-1)
    navigate("/login");
    throw new Error("unauthorized");
  }

  function signOut(navigate: (path: string) => void) {
    setSelectedListID(-1)
    setJwtToken("");
    Cookies.set("jwtToken", "");
    navigate("/login");
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage jwtToken={jwtToken} setJwtToken={setJwtToken} signOut={signOut}/>}
        />
        <Route
          path="/"
          element={<LoginPage jwtToken={jwtToken} setJwtToken={setJwtToken} signOut={signOut}/>}
        />
        <Route
          path="/lists"
          element={
            <ListPage
              jwtToken={jwtToken}
              handleJwtFailure={handleJwtFailure}
              signOut={signOut}
              setSelectedListID={setSelectedListID}
            />
          }
        />
        <Route
          path="/entries"
          element={
            <EntryPage
              jwtToken={jwtToken}
              handleJwtFailure={handleJwtFailure}
              signOut={signOut}
              setSelectedListID={setSelectedListID}
              selectedListID={selectedListID}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
