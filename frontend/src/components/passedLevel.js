import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

export default function PassedLevel({ levelNum = 0 }) {
  const { theme } = useTheme();

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