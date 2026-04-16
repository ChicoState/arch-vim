import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const buttonClass =
        theme === "dark"
            ? "rounded-lg border border-slate-500 px-3 py-1 text-sm text-white bg-gray-950 hover:opacity-80"
            : "rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-900 bg-white hover:bg-slate-100";

    return (
        <button onClick={toggleTheme} className={buttonClass}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
    );
}


