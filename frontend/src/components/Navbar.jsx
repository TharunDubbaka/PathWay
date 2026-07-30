import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-block">
          <div className="brand">Roadmap Generator</div>
          <div className="brand-subtitle">Plan smarter learning journeys.</div>
        </div>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/study-plan">Study Plan</NavLink>
          <NavLink to="/quiz">Quiz</NavLink>
          <NavLink to="/analysis">Analysis</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
