import { Link } from "react-router-dom";
import "./Modes.css";

export default function ExpertMode() {
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
        <h1 className="mode-detail-title">Expert Mode</h1>
      </div>

      <ul className="mode-detail-list">
        <li><Link to="/levels/11" className="mode-detail-level-link">Level 11</Link></li>
        <li><Link to="/levels/12" className="mode-detail-level-link">Level 12</Link></li>
        <li><Link to="/levels/13" className="mode-detail-level-link">Level 13</Link></li>
        <li><Link to="/levels/14" className="mode-detail-level-link">Level 14</Link></li>
      </ul>

      <div className="mode-detail-challenge-wrap">
        <div className="mode-detail-challenge-inner">
          <Link to="/levels/15" className="mode-detail-challenge-link">Challenge</Link>
        </div>
      </div>
    </div>
  );
}