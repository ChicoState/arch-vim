import { Link } from "react-router-dom";
import "./Levels.css";

export default function Levels() {
  return (
    <div className="mode-page">
      <div className="mode-topbar">
        <div className="mode-nav">
          <Link to="/" className="pill-btn">
            <span className="arrow">↗</span>
            <span>Home</span>
          </Link>

          <Link to="/levels" className="pill-btn">
            <span>MODE SELECT</span>
          </Link>
        </div>

        <div className="mode-year">2026</div>
      </div>

      <h1 className="mode-title">MODE SELECT</h1>

      <div className="mode-card-grid">
        <Link to="/levels/beginner" className="mode-card-link">
          <div className="mode-card">
            <div className="mode-badge">/1</div>
            <h2>Beginner Mode</h2>
            <p>
              Start with the basics of Vim, including navigation, quitting,
              typing, and saving your changes.
            </p>
          </div>
        </Link>

        <Link to="/levels/advanced" className="mode-card-link">
          <div className="mode-card">
            <div className="mode-badge">/2</div>
            <h2>Advanced Mode</h2>
            <p>
              Build stronger command skills and learn more efficient editing
              techniques for faster workflow.
            </p>
          </div>
        </Link>

        <Link to="/levels/expert" className="mode-card-link">
          <div className="mode-card">
            <div className="mode-badge">/3</div>
            <h2>Expert Mode</h2>
            <p>
              Push your Vim mastery further with advanced motion, precision, and
              speed-focused challenges.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}