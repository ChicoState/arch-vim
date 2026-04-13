import { Link } from "react-router-dom";
import "./Modes.css";

export default function AdvancedMode() {
  return (
    <div className="mode-detail-page">
      <div className="mode-detail-topbar">
        <div className="mode-detail-nav">
          <Link to="/" className="mode-detail-pill">
            <span className="mode-detail-arrow">↗</span>
            <span>Home</span>
          </Link>
          <Link to="/levels" className="mode-detail-pill"><span>MODE SELECT</span></Link>
        </div>
        <div className="mode-detail-year">2026</div>
      </div>

      <div className="mode-detail-title-row">
        <h1 className="mode-detail-title">Advanced Mode</h1>
      </div>

      <ul className="mode-detail-list">
        <li><Link to="/levels/6" className="mode-detail-level-link">Level 6</Link></li>
        <li><Link to="/levels/7" className="mode-detail-level-link">Level 7</Link></li>
        <li><Link to="/levels/8" className="mode-detail-level-link">Level 8</Link></li>
        <li><Link to="/levels/9" className="mode-detail-level-link">Level 9</Link></li>
      </ul>

      <div className="mode-detail-challenge-wrap">
        <div className="mode-detail-challenge-inner">
          <Link to="/levels/10" className="mode-detail-challenge-link">Challenge</Link>
        </div>
      </div>
    </div>
  );
}