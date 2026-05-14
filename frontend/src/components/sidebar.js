import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCheckLevel from "../components/checkLevelPassed";
import ThemeToggle from "./themeToggle";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";


function LevelCheck({ levelNum = 0, levelDesc = "", theme = "dark" }) {
  const passed = useCheckLevel(levelNum);

  return passed ? (
    <Link
      to={`/levels/${levelNum}`}
      className={
        theme === "dark"
          ? [
              "text-green-400",
              "hover:text-green-300",
              "text-sm",
              "leading-6",
              "font-medium",
              "transition",
              "duration-300",
              "ease-in-out"
            ].join(" ")
          : [
              "text-green-600",
              "hover:text-green-700",
              "text-sm",
              "leading-6",
              "font-medium",
              "transition",
              "duration-300",
              "ease-in-out"
            ].join(" ")
      }
    >
      {levelDesc}
    </Link>
  ) : (
    <Link
      to={`/levels/${levelNum}`}
      className={
        theme === "dark"
          ? [
              "text-white",
              "hover:text-gray-300",
              "text-sm",
              "leading-8",
              "font-medium",
              "transition",
              "duration-300",
              "ease-in-out"
            ].join(" ")
          : [
              "text-slate-800",
              "hover:text-slate-600",
              "text-sm",
              "leading-6",
              "font-medium",
              "transition",
              "duration-300",
              "ease-in-out"
            ].join(" ")
      }
    >
      {levelDesc}
    </Link>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [normalOpen, setIntroOpen] = useState(true);
  const [insertOpen, setIntermediateOpen] = useState(true);
  const [searchNavOpen, setAdvancedOpen] = useState(true);
  const [editOpen, setMoreOneOpen] = useState(true);
  const [advancedToolsOpen, setMoreTwoOpen] = useState(true);
  const [challengesOpen, setMoreThreeOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const wrapperClass =
    theme === "dark"
      ? [
          "w-full",
          "max-h-[96dvh]",
          "rounded-3xl",
          "bg-gray-950",
          "border",
          "border-indigo-500/30",
          "shadow-[0_0_24px_rgba(99,102,241,0.7)]",
          "p-5",
          "relative",
          "text-xl",
          "text-white",
          "backdrop-blur-sm",
          "overflow-hidden",
          "transition",
          "duration-500",
          "ease-in-out"
        ].join(" ")
      : [
          "w-full",
          "h-[96vh]",
          "rounded-3xl",
          "bg-white",
          "border-2",
          "border-indigo-300",
          "shadow-[0_0_55px_rgba(99,102,241,0.34),0_22px_48px_rgba(99,102,241,0.16)]",
          "p-5",
          "relative",
          "text-xl",
          "text-slate-900",
          "backdrop-blur-sm",
          "overflow-hidden",
          "transition",
          "duration-500",
          "ease-in-out"
        ].join(" ");

  const hrClass =
    theme === "dark"
      ? [
          "mb-4",
          "border-gray-600",
          "transition",
          "duration-300"
        ].join(" ")
      : [
          "mb-4",
          "border-slate-300",
          "transition",
          "duration-300"
        ].join(" ");

  const topLinkClass =
    theme === "dark"
      ? [
          "inline-block",
          "mb-4",
          "px-4",
          "py-2",
          "rounded-xl",
          "bg-indigo-600",
          "text-white",
          "text-2xl",
          "font-semibold",
          "hover:bg-indigo-500",
          "shadow-[0_0_12px_rgba(99,102,241,0.35)]",
          "transition",
          "duration-300",
          "ease-in-out"
        ].join(" ")
      : [
          "inline-block",
          "mb-4",
          "px-4",
          "py-2",
          "rounded-xl",
          "bg-slate-300",
          "text-white",
          "text-2xl",
          "font-semibold",
          "hover:bg-slate-400",
          "shadow-[0_0_10px_rgba(148,163,184,0.25)]",
          "transition",
          "duration-300",
          "ease-in-out"
        ].join(" ");

  const levelsClass =
    theme === "dark"
      ? [
          "text-3xl",
          "mb-2",
          "text-indigo-400",
          "font-semibold",
          "drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]",
          "transition",
          "duration-300"
        ].join(" ")
      : [
          "text-3xl",
          "mb-2",
          "text-indigo-500",
          "font-semibold",
          "drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]",
          "transition",
          "duration-300"
        ].join(" ");

  const sectionClass =
    theme === "dark"
      ? [
          "pl-4",
          "text-lg",
          "font-semibold",
          "text-white",
          "tracking-wide"
        ].join(" ")
      : [
          "pl-4",
          "text-lg",
          "font-semibold",
          "text-slate-900",
          "tracking-wide"
        ].join(" ");

  const sectionContentClass =
    [
      "pl-6",
      "overflow-hidden",
      "transition-all",
      "duration-300",
      "ease-in-out"
    ].join(" ");

  const arrowClass =
    theme === "dark"
      ? [
          "text-lg",
          "text-indigo-300",
          "ml-3",
          "transition",
          "duration-300",
          "ease-in-out"
        ].join(" ")
      : [
          "text-lg",
          "text-indigo-500",
          "ml-3",
          "transition",
          "duration-300",
          "ease-in-out"
        ].join(" ");

  const bottomClass =
    theme === "dark"
      ? [
          "absolute",
          "left-5",
          "bottom-5",
          "flex",
          "items-center",
          "gap-3",
          "text-2xl",
          "text-white"
        ].join(" ")
      : [
          "absolute",
          "left-5",
          "bottom-5",
          "flex",
          "items-center",
          "gap-3",
          "text-lg",
          "text-slate-900"
        ].join(" ");

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col h-full">
        <div>
          <h1 className="text-center text-4xl mb-2">Navigation</h1>
          <hr className={hrClass} />

          <div className="mb-3">
            <Link to="/" className={topLinkClass}>Home</Link></div>
          <h2 className={levelsClass}>Levels</h2>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <button
            type="button"
            className={sectionClass}
            onClick={() => setIntroOpen((prev) => !prev)}
          >
            <span>Normal Mode Basics</span>
            <span className={arrowClass}>{normalOpen ? "▾" : "▸"}</span>
          </button><br/>
          {normalOpen && (
            <div className={sectionContentClass}>
              <LevelCheck levelNum={1} levelDesc={"Basic Navigation"} theme={theme} /><br />
              <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"} theme={theme} /><br />
              <LevelCheck levelNum={4} levelDesc={"How to save files"} theme={theme} /><br />
              <LevelCheck levelNum={6} levelDesc={"Jump By Words"} theme={theme} /><br />
              <LevelCheck levelNum={7} levelDesc={"Line Navigation"} theme={theme} />
            </div>
          )}
          <br />
          

          <button
            type="button"
            className={sectionClass}
            onClick={() => setIntermediateOpen((prev) => !prev)}
          >
            <span>Insert Mode</span>
            <span className={arrowClass}>{insertOpen ? "▾" : "▸"}</span>
          </button><br />
          {insertOpen && (
            <div className={sectionContentClass}>
              <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"} theme={theme} /><br />
              <LevelCheck levelNum={18} levelDesc={"Change a word"} theme={theme} /><br />
              <LevelCheck levelNum={19} levelDesc={"Replace a character"} theme={theme} /><br />
              <LevelCheck levelNum={22} levelDesc={"Text objects"} theme={theme} /><br />
              <LevelCheck levelNum={23} levelDesc={"Visual Mode"} theme={theme} />
            </div>
          )}
          <br />

          <button
            type="button"
            className={sectionClass}
            onClick={() => setAdvancedOpen((prev) => !prev)}
          >
            <span>Search & Navigation</span>
            <span className={arrowClass}>{searchNavOpen ? "▾" : "▸"}</span>
          </button><br/>
          {searchNavOpen && (
            <div className={sectionContentClass}>
              <LevelCheck levelNum={11} levelDesc={"Basic Search"} theme={theme} /><br />
              <LevelCheck levelNum={13} levelDesc={"Jump between brackets"} theme={theme} /><br />
              <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"} theme={theme} /><br />
              <LevelCheck levelNum={16} levelDesc={"Jump to a character"} theme={theme} /><br />
              <LevelCheck levelNum={17} levelDesc={"Jump between paragraphs"} theme={theme} />
            </div>
          )}
          <br />

          <button
            type="button"
            className={sectionClass}
            onClick={() => setMoreOneOpen((prev) => !prev)}
          >
            <span>Editing Commands</span>
            <span className={arrowClass}>{editOpen ? "▾" : "▸"}</span>
          </button><br/>
          {editOpen && (
            <div className={sectionContentClass}>
              <LevelCheck levelNum={8} levelDesc={"Delete a line"} theme={theme} /><br />
              <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"} theme={theme} /><br />
              <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"} theme={theme} /><br />
              <LevelCheck levelNum={20} levelDesc={"Repeat actions"} theme={theme} /><br />
              <LevelCheck levelNum={21} levelDesc={"Operators and motions"} theme={theme} />
            </div>
          )}
          <br />

          <button
            type="button"
            className={sectionClass}
            onClick={() => setMoreTwoOpen((prev) => !prev)}
          >
            <span>Advanced Tools</span>
            <span className={arrowClass}>{advancedToolsOpen ? "▾" : "▸"}</span>
          </button><br/>
          {advancedToolsOpen && (
            <div className={sectionContentClass}>
              <LevelCheck levelNum={24} levelDesc={"Find and replace"} theme={theme} /><br />
              <LevelCheck levelNum={25} levelDesc={"Marking Locations"} theme={theme} /><br />
              <LevelCheck levelNum={26} levelDesc={"Macros"} theme={theme} />
            </div>
          )}
          <br />

          <button
            type="button"
            className={sectionClass}
            onClick={() => setMoreThreeOpen((prev) => !prev)}
          >
            <span>Challenges</span>
            <span className={arrowClass}>{challengesOpen ? "▾" : "▸"}</span>
          </button>
          {challengesOpen && (
            <div className={sectionContentClass}> 
              <LevelCheck levelNum={5} levelDesc={"Challenge - Easy"} theme={theme} /><br />
              <LevelCheck levelNum={10} levelDesc={"Challenge - Medium"} theme={theme} /><br />
              <LevelCheck levelNum={15} levelDesc={"Challenge - Hard"} theme={theme} /><br />
              <LevelCheck levelNum={27} levelDesc={"Challenge - Expert"} theme={theme} />
            </div>
          )}
        </div>

        <div className="pt-3 mt-2">
          <div className="flex items-center gap-3 text-2xl">
            <span>{user?.username || "Guest"}</span>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              Logout
            </button><br/>
          </div>
        </div>

        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
