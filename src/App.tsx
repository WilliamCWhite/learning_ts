import { Routes, Route, useNavigate } from 'react-router-dom'
import About from './pages/About.tsx'
import Login from './pages/Login.tsx'
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
  const [jwtToken, setJwtToken] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (jwtToken.length === 0) {
      setIsLoggedIn(false)
    }
    else {
      setIsLoggedIn(true)
    }
  }, [jwtToken, isLoggedIn])

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login jwtToken={jwtToken} setJwtToken={setJwtToken}/>} />

        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
