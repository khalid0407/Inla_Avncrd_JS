import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateCsrf, registerUser } from "../../services";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [avatar] = useState(() => {
    const randomId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/80?img=${randomId}`;
  });
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const csrfToken = await generateCsrf();
      await registerUser(username, password, email, avatar, csrfToken);
      setSuccess("Registration successful, redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        "Registration failed. The username or email may already be in use, or the input is invalid."
      );
      console.error(err);
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="avatar-container" style={{ textAlign: "center", margin: "12px 0" }}>
          <img
            src={avatar}
            alt="Avatar preview"
            className="avatar"
            onError={(e) => (e.currentTarget.src = "https://i.pravatar.cc/80")}
          />
        </div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;