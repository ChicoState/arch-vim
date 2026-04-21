import Login from "../components/login";
import useCheckLevel from "../components/checkLevelPassed";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

function ingestLevelInfo() {}

function LevelCheck({ levelNum = 0, levelDesc = "", theme = "dark" }) {
  const passed = useCheckLevel(levelNum);

  const passedClass =
    theme === "dark"
      ? "text-green-500 hover:text-green-700"
      : "text-green-600 hover:text-green-800";

  const defaultClass =
    theme === "dark"
      ? "hover:text-gray-400"
      : "text-slate-700 hover:text-slate-500";

  return passed ? (
    <Link to={`/levels/${levelNum}`} className={passedClass}>
      Level {levelNum} - {levelDesc}
    </Link>
  ) : (
    <Link to={`/levels/${levelNum}`} className={defaultClass}>
      Level {levelNum} - {levelDesc}
    </Link>
  );
}

export default function Home() {
  const { theme } = useTheme();

  const pageClass =
    theme === "dark"
      ? "bg-gray-950 text-white"
      : "bg-slate-50 text-slate-900";

  const cardClass =
    theme === "dark"
      ? "bg-gray-950 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]"
      : "bg-white text-slate-900 border border-slate-200 shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:shadow-[0_14px_36px_rgba(99,102,241,0.22)]";

  const hrClass =
    theme === "dark" ? "border-gray-600" : "border-slate-200";

  const subtitleClass =
    theme === "dark" ? "text-white" : "text-slate-600";

  return (
    <div className={`${pageClass} p-6 min-h-screen`}>
      <div className="fixed top-5 right-10 z-50">
        <Login />
      </div>
      <h1 className="font-mono text-center text-9xl pt-[20vh] font-bold">Arch-Vim</h1>
      <br />
      <p className={`text-center ${subtitleClass}`}>Learn Vim, One step at a time</p>
      <div className="flex gap-20 justify-center pt-[25vh]">
        <div className={`w-[20vw] h-64 rounded-2xl p-6 text-xl transition duration-500 ease-in-out hover:scale-110 ${cardClass}`}>
          <h2 className="text-center mb-2">Intro</h2>
          <hr className={`mb-4 ${hrClass}`} />
          <div className="pl-5 text-base">
            <LevelCheck levelNum={1} levelDesc={"Learn Navigation"} theme={theme} /><br />
            <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"} theme={theme} /><br />
            <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"} theme={theme} /><br />
            <LevelCheck levelNum={4} levelDesc={"How to save files"} theme={theme} /><br />
            <LevelCheck levelNum={5} levelDesc={"Challenge!"} theme={theme} /><br />
          </div>
        </div>
        <div className={`w-[20vw] h-64 rounded-2xl p-6 text-xl transition duration-500 ease-in-out hover:scale-110 ${cardClass}`}>
          <h2 className="text-center mb-2">Intermediate</h2>
          <hr className={`mb-4 ${hrClass}`} />
          <div className="pl-5 text-base">
            <LevelCheck levelNum={6} levelDesc={"More Navigation"} theme={theme} /><br />
            <LevelCheck levelNum={7} levelDesc={"Even More Navigation!"} theme={theme} /><br />
            <LevelCheck levelNum={8} levelDesc={"Delete a line"} theme={theme} /><br />
            <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"} theme={theme} /><br />
            <LevelCheck levelNum={10} levelDesc={"Challenge!"} theme={theme} /><br />
          </div>
        </div>
        <div className={`w-[20vw] h-64 rounded-2xl p-6 text-xl transition duration-500 ease-in-out hover:scale-110 ${cardClass}`}>
          <h2 className="text-center mb-2">Advanced</h2>
          <hr className={`mb-4 ${hrClass}`} />
          <div className="pl-5 text-base">
            <LevelCheck levelNum={11} levelDesc={"Basic Search"} theme={theme} /><br />
            <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"} theme={theme} /><br />
            <LevelCheck levelNum={13} levelDesc={"Jump between brackets"} theme={theme} /><br />
            <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"} theme={theme} /><br />
            <LevelCheck levelNum={15} levelDesc={"Challenge!"} theme={theme} /><br />
          </div>
        </div>
      </div>
    </div>
  );
}