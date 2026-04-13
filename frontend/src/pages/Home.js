import { Link } from "react-router-dom";
import "./Home.css";
import logo from "../logo.svg";

export default function Home() {
  return (
    <>
      {/* Original code kept here
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Arch-Vim</h1>
          <p>Learn Vim, One step at a time</p>
        </header>
      </div>
      */}

      <div className="home-page">
        <div className="home-topbar">
          <div className="home-nav">
            <Link to="/" className="home-pill">
              <span className="home-arrow">↗</span>
              <span>Home</span>
            </Link>

            <Link to="/levels" className="home-pill">
              <span>MODE SELECT</span>
            </Link>
          </div>

          <div className="home-year">2026</div>
        </div>

        <div className="home-heading-row">
          <h1 className="home-title">ARCH VIM</h1>
        </div>

        <div className="home-guidance-panel">
          <div className="home-guidance-title">
            <span className="home-guidance-line">--------</span>
            <span>GUIDANCE</span>
            <span className="home-guidance-line">--------</span>
          </div>

          <div className="home-guidance-body">
            <p>Put our guidance here guys</p>
          </div>
        </div>

        {/* Original quick levels box kept here
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "50px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#1e1e1e",
          }}>
            <h2>Quick Levels</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link to="/levels/1">Level 1</Link>
              </li>
            </ul>
        </div>
        */}
      </div>
    </>
  );
}