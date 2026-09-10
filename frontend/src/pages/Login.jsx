import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";
import { saveToken } from "../auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = isRegistering
        ? await register({ email, password })
        : await login({ email, password });
      saveToken(result.token);
      navigate(location.state?.from || "/", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="tag-pill">PathWay</span>
          <h1>{isRegistering ? "Create your learning space" : "Welcome back"}</h1>
          <p>Keep your goals, progress, and personalized study paths together.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="field-label" htmlFor="password">Password</label>
          <input id="password" className="text-input" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <div className="error-message">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Create account" : "Log in"}
          </button>
          <button className="text-button" type="button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
