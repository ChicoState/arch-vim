import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Levels from './pages/Levels.js';
import Level1 from './pages/levels/Level1.js';
import Level2 from './pages/levels/Level2.js';
import Level3 from './pages/levels/Level3.js';
import Level4 from './pages/levels/Level4.js';
import Level5 from './pages/levels/Level5.js';
import Home from './pages/Home.js';
import { write, read } from "./utils/session";

function App() {
  const [progress, setProgress] = useState({
    unlocked: 1,
    completed: [],
  });

  // Load saved progress on startup + backend ping
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));

    const saved = read();
    if (saved) {
      setProgress(saved);
    }
  }, []);

  // Save handlers
  const handleSave = () => {
    write(progress);
    alert("Progress saved");
  };

  const handleLoad = () => {
    const saved = read();
    if (saved) {
      setProgress(saved);
      alert("Progress loaded");
    }
  };

  const handleReset = () => {
    const reset = { unlocked: 1, completed: [] };
    setProgress(reset);
    write(reset);
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/levels">Levels</Link>
      </nav>

      {/* Save Controls */}
      <div style={{ margin: "10px" }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleLoad}>Load</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<Levels progress={progress} />} />
        <Route
          path="/levels/1"
          element={<Level1 progress={progress} setProgress={setProgress} />}
        />
        <Route
          path="/levels/2"
          element={<Level2 progress={progress} setProgress={setProgress} />}
        />
        <Route
          path="/levels/3"
          element={<Level3 progress={progress} setProgress={setProgress} />}
        />
        <Route
          path="/levels/4"
          element={<Level4 progress={progress} setProgress={setProgress} />}
        />
        <Route
          path="/levels/5"
          element={<Level5 progress={progress} setProgress={setProgress} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;