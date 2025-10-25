import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Chat from "./components/chat/Chat";
import ProtectedRouted from "./components/route/ProtectedRoute";
import Nav from "./components/nav/Nav";

function App() {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken") || localStorage.getItem("token");
    if (token && !user) {
      setUser({ username: "User" });
    }
  }, [user]);

  return (
    <Router>
  {user && <Nav user={user} setUser={setUser} />}

      <Routes>
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" replace />} />
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/chat" replace />} />
        <Route
          path="/chat"
          element={
            user ? (
              <ProtectedRouted>
                <Chat user={user} setUser={setUser} />
              </ProtectedRouted>
            ) : (
              <Navigate to="/register" replace />
            )
          }
        />
        <Route
          path="*"
          element={user ? <Navigate to="/chat" replace /> : <Navigate to="/register" replace />}
        />
      </Routes>
    </Router>
  );
}
export default App;