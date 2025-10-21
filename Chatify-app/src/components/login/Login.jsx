import { useState } from "react";
import { loginUser } from "../../services";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      await loginUser(username, password);
      setUser?.({ username });
      setSuccess("Login successful, redirecting to chat...");
      setTimeout(() => {
        navigate("/chat");
      }, 1200);
    } catch (err) {
      setError("Login failed. Please check your username and password.");
      console.error(err);
    }
  }

  return (
    <div className="register-container">
      <h2>Login</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        <p className="login-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;