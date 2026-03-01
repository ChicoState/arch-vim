import logo from './logo.svg';
import './App.css';

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from 'react';
import VimEditor from './editor/vimEditor.js';
//import Level from './pages/levels/level.js';
import Levels from './pages/Levels.js';
import Level1 from './pages/levels/Level1.js';
import Level2 from './pages/levels/Level2.js';
import Level3 from './pages/levels/Level3.js';
import Level4 from './pages/levels/Level4.js';
import Home from './pages/Home.js';

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/") //Django backend url probably something like /api/progress to get level progress
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/levels">Levels</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/levels/1" element={<Level1 />} />
        <Route path="/levels/2" element={<Level2 />} />
        <Route path="/levels/3" element={<Level3 />} />
        <Route path="/levels/4" element={<Level4 />} />
      </Routes>
    </BrowserRouter>
    



//ignore this, this was the default react stuff, I'm keeping as a reference for formatting later
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
	// <VimEditor />
  //     </header>
  //   </div>
  );
}

export default App;
