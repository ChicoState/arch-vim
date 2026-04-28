import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Levels from './pages/Levels.js';
import Level1 from './pages/levels/Level1.js';
import Level2 from './pages/levels/Level2.js';
import Level3 from './pages/levels/Level3.js';
import Level4 from './pages/levels/Level4.js';
import Level5 from './pages/levels/Level5.js';
import Level6 from './pages/levels/Level6.js';
import Level7 from './pages/levels/Level7.js';
import Level8 from './pages/levels/Level8.js';
import Level9 from './pages/levels/Level9.js';
import Level10 from './pages/levels/Level10.js';
import Level11 from './pages/levels/Level11.js';
import Level12 from './pages/levels/Level12.js';
import Level13 from './pages/levels/Level13.js';
import Level14 from './pages/levels/Level14.js';
import Level15 from './pages/levels/Level15.js';
import Level16 from './pages/levels/Level16.js';
import Level17 from './pages/levels/Level17.js';
import Level18 from './pages/levels/Level18.js';
import Level19 from './pages/levels/Level19.js';
import Level20 from './pages/levels/Level20.js';
import Level21 from './pages/levels/Level21.js';
import Level22 from './pages/levels/Level22.js';
import Level23 from './pages/levels/Level23.js';
import Level24 from './pages/levels/Level24.js';
import Level25 from './pages/levels/Level25.js';
import Level26 from './pages/levels/Level26.js';
import Level27 from './pages/levels/Level27.js';
import LevelTest from './pages/levels/levelTest.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';

import { AuthProvider } from './AuthContext.js';
import { useTheme } from "./ThemeContext.js";
import { ProgressProvider } from './components/checkLevelPassed.js';

function AppInner() {
  const { theme } = useTheme();

  // useEffect(() => {
  //   fetch("http://localhost:8000/")
  //     .then((res) => res.text())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // }, []);

  const appTheme =
    theme === "dark"
      ? "min-h-screen bg-slate-950 text-white"
      : "min-h-screen bg-slate-50 text-slate-900";

  return (
    <div className={appTheme}>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/levels/1" element={<Level1 />} />
          <Route path="/levels/2" element={<Level2 />} />
          <Route path="/levels/3" element={<Level3 />} />
          <Route path="/levels/4" element={<Level4 />} />
          <Route path="/levels/5" element={<Level5 />} />
          <Route path="/levels/6" element={<Level6 />} />
          <Route path="/levels/7" element={<Level7 />} />
          <Route path="/levels/8" element={<Level8 />} />
          <Route path="/levels/9" element={<Level9 />} />
          <Route path="/levels/10" element={<Level10 />} />
          <Route path="/levels/11" element={<Level11 />} />
          <Route path="/levels/12" element={<Level12 />} />
          <Route path="/levels/13" element={<Level13 />} />
          <Route path="/levels/14" element={<Level14 />} />
          <Route path="/levels/15" element={<Level15 />} />
          <Route path="/levels/16" element={<Level16 />} />
          <Route path="/levels/17" element={<Level17 />} />
          <Route path="/levels/18" element={<Level18 />} />
          <Route path="/levels/19" element={<Level19 />} />
          <Route path="/levels/20" element={<Level20 />} />
          <Route path="/levels/21" element={<Level21 />} />
          <Route path="/levels/22" element={<Level22 />} />
          <Route path="/levels/23" element={<Level23 />} />
          <Route path="/levels/24" element={<Level24 />} />
          <Route path="/levels/25" element={<Level25 />} />
          <Route path="/levels/26" element={<Level26 />} />
          <Route path="/levels/27" element={<Level27 />} />
          <Route path="/levels/test" element={<LevelTest />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ProgressProvider>
  );
}