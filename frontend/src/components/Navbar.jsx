import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearToken, isAuthenticated } from "../auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-block">
          <div className="brand">Roadmap Generator</div>
          <div className="brand-subtitle">Plan smarter learning journeys.</div>
        </div>
        {authenticated && (
          <nav key={location.pathname}>
            <NavLink to="/" end>Goals</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/study-plan">Study Plan</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/analysis">Analysis</NavLink>
            <button className="nav-logout" onClick={handleLogout}>Log out</button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
