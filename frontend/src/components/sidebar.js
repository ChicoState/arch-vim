import { Link, useNavigate } from "react-router-dom";
import useCheckLevel from "../components/checkLevelPassed";
import ThemeToggle from "./themeToggle";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

function callBackend() {}

function LevelCheck({ levelNum = 0, levelDesc = "", theme = "dark" }) {
  const passed = useCheckLevel(levelNum);

  return passed ? (
    <Link
      to={`/levels/${levelNum}`}
      className={
        theme === "dark"
          ? "text-green-400 hover:text-green-300 text-[1rem] leading-8"
          : "text-green-600 hover:text-green-700 text-[1rem] leading-8"
      }
    >
      Level {levelNum} - {levelDesc}
    </Link>
  ) : (
    <Link
      to={`/levels/${levelNum}`}
      className={
        theme === "dark"
          ? "text-white hover:text-gray-300 text-[1rem] leading-8"
          : "text-slate-800 hover:text-slate-600 text-[1rem] leading-8"
      }
    >
      Level {levelNum} - {levelDesc}
    </Link>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const wrapperClass =
    theme === "dark"
      ? "w-full min-h-[96vh] rounded-3xl bg-gray-950 shadow-[0_0_24px_rgba(99,102,241,0.7)] p-5 relative text-xl text-white"
      : "w-full min-h-[96vh] rounded-3xl bg-white border-2 border-indigo-300 shadow-[0_0_55px_rgba(99,102,241,0.34),0_22px_48px_rgba(99,102,241,0.16)] p-5 relative text-xl text-slate-900";

  const hrClass =
    theme === "dark" ? "mb-4 border-gray-600" : "mb-4 border-slate-300";

  const topLinkClass =
    theme === "dark"
      ? "inline-block mb-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-2xl font-semibold hover:bg-indigo-500 transition"
      : "inline-block mb-4 px-4 py-2 rounded-xl bg-slate-300 text-white text-2xl font-semibold hover:bg-slate-400 transition";

  const sectionClass =
    theme === "dark"
      ? "pl-4 text-2xl font-semibold text-white"
      : "pl-4 text-2xl font-semibold text-slate-900";

  const bottomClass =
    theme === "dark"
      ? "absolute left-5 bottom-5 flex items-center gap-3 text-2xl text-white"
      : "absolute left-5 bottom-5 flex items-center gap-3 text-2xl text-slate-900";

  return (
    <div className={wrapperClass}>
      <h1 className="text-center text-4xl mb-2">Navigation</h1>
      <hr className={hrClass} />

      <div className="mb-3">        
        <Link to="/" className={topLinkClass}>Home</Link></div>
      <h2 className="text-3xl mb-2">Levels</h2>

      <h3 className={sectionClass}>Intro</h3>
      <div className="pl-6 mb-2">
        <LevelCheck levelNum={1} levelDesc={"Learn Navigation"} theme={theme} /><br />
        <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"} theme={theme} /><br />
        <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"} theme={theme} /><br />
        <LevelCheck levelNum={4} levelDesc={"How to save files"} theme={theme} /><br />
        <LevelCheck levelNum={5} levelDesc={"Challenge!"} theme={theme} /><br />
      </div>

      <br />

      <h3 className={sectionClass}>Intermediate</h3>
      <div className="pl-6 mb-2">
        <LevelCheck levelNum={6} levelDesc={"More Navigation"} theme={theme} /><br />
        <LevelCheck levelNum={7} levelDesc={"Even More Navigation!"} theme={theme} /><br />
        <LevelCheck levelNum={8} levelDesc={"Delete a line"} theme={theme} /><br />
        <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"} theme={theme} /><br />
        <LevelCheck levelNum={10} levelDesc={"Challenge!"} theme={theme} /><br />
      </div>

      <br />

      <h3 className={sectionClass}>Advanced</h3>
      <div className="pl-6">
        <LevelCheck levelNum={11} levelDesc={"Basic Search"} theme={theme} /><br />
        <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"} theme={theme} /><br />
        <LevelCheck levelNum={13} levelDesc={"Jump between brackets"} theme={theme} /><br />
        <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"} theme={theme} /><br />
        <LevelCheck levelNum={15} levelDesc={"Challenge!"} theme={theme} /><br />
      </div>

      <div className={bottomClass}>
        <span>{user?.username || "Guest"}</span>
        <button
          onClick={handleLogout}
          className="hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
    </div>
  );
}