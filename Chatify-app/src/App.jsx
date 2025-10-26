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
        {!user && <Route path="/register" element={<Register />} />}
        {!user && <Route path="/login" element={<Login setUser={setUser} />} />}
        {user && (
          <Route
            path="/chat"
            element={
              <ProtectedRouted>
                <Chat user={user} setUser={setUser} />
              </ProtectedRouted>
            }
          />
        )}

        {}
        <Route
          path="*"
          element={user ? <Navigate to="/chat" /> : <Navigate to="/register" />}
        />
      </Routes>
    </Router>
  );
}
export default App;