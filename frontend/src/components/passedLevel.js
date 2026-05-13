import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function PassedLevel({ levelNum = 0, strokes = null, ms = null }) {
  const { theme } = useTheme();

  function formatTime(ms) {
    if (ms == null) return null;

    const totalSec = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const sec = String(totalSec % 60).padStart(2, "0");

    return `${min}:${sec}`;
  }
  const formattedTime = formatTime(ms);

  return (
    <div
      className={
        theme === "dark"
          ? "rounded-2xl p-5 bg-gray-950 border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.45)]"
          : "rounded-2xl p-5 bg-white border border-green-400 shadow-[0_0_16px_rgba(34,197,94,0.25)]"
      }
    >
      <h2
        className={
          theme === "dark"
            ? "text-3xl font-bold mb-4 text-green-400"
            : "text-3xl font-bold mb-4 text-green-600"
        }
      >
        You passed!
      </h2>
      {(strokes !== null || formattedTime !== null) && (
        <div
          className={
            theme === "dark"
              ? "mb-4 text-green-300"
              : "mb-4 text-green-700"
          }
        >
          {strokes !== null && (
            <p className="text-lg">
              Strokes: <span className="font-semibold">{strokes}</span>
            </p>
          )}

          {formattedTime !== null && (
            <p className="text-lg">
              Time: <span className="font-semibold">{formattedTime}</span>
            </p>
          )}
        </div>
      )}
      <p className={theme === "dark" ? "text-lg mb-2 text-white" : "text-lg mb-2 text-slate-900"}>
        Move on to the next level:{" "}
        <Link
          to={`/levels/${levelNum + 1}`}
          className={theme === "dark" ? "text-green-400 font-semibold" : "text-green-600 font-semibold"}
        >
          Level {levelNum + 1}
        </Link>
      </p>

      <p className={theme === "dark" ? "text-lg text-white" : "text-lg text-slate-900"}>
        Or go back home:{" "}
        <Link
          to="/"
          className={theme === "dark" ? "text-green-400 font-semibold" : "text-green-600 font-semibold"}
        >
          Home
        </Link>
      </p>
    </div>
  );
}
