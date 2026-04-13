import { Link } from "react-router-dom";
import "./Modes.css";

export default function BeginnerMode() {
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
        <h1 className="mode-detail-title">Beginner Mode</h1>
      </div>

      <ul className="mode-detail-list">
        <li><Link to="/levels/1" className="mode-detail-level-link">Level 1</Link></li>
        <li><Link to="/levels/2" className="mode-detail-level-link">Level 2</Link></li>
        <li><Link to="/levels/3" className="mode-detail-level-link">Level 3</Link></li>
        <li><Link to="/levels/4" className="mode-detail-level-link">Level 4</Link></li>
      </ul>

      <div className="mode-detail-challenge-wrap">
        <div className="mode-detail-challenge-inner">
          <Link to="/levels/5" className="mode-detail-challenge-link">Challenge</Link>
        </div>
      </div>
    </div>
  );
}