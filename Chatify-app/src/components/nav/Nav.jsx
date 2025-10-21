import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services";
import "./nav.css";

function SideNav({ setUser }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    logoutUser();
    if (setUser) setUser(null);
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

      <div className={`side-nav ${open ? "open" : ""}`}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}

export default SideNav;