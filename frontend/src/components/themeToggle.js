import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      onClick={toggleTheme}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300
        ${isDark ? "bg-indigo-600" : "bg-gray-300"}`}
    >
      <div
        className={`w-4 h-4 flex items-center justify-center rounded-full bg-white shadow-md transform transition duration-300
          ${isDark ? "translate-x-6" : "translate-x-0"}`}
      >
        {/* ICON INSIDE */}
        <span className="text-[10px]">
          {isDark ? "🌙" : "🌞"}
        </span>
      </div>
    </div>
  );
}