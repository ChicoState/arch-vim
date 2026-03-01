import { Link } from "react-router-dom";
import logo from '../logo.svg'
export default function Home() {
    return (
    //   <div className="App">
    //     <header className="App-header">
    //       <img src={logo} className="App-logo" alt="logo" />
    //       <h1>Arch-Vim</h1>
    //       <p>Learn Vim, One step at a time</p>
    //     </header>
    // </div>
      <div style={{ position: "relative", minHeight: "100vh", padding: "20px" }}>
        <h1>Arch-Vim</h1>
        <p>Learn Vim, One step at a time</p>

        {/* <div
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
          </div> */}
      </div>
    );
}