import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

export default function Login() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const wrapperClass =
        theme === "dark"
            ? "flex items-center gap-3 text-white"
            : "flex items-center gap-3 text-slate-900";

    const buttonClass =
        theme === "dark"
            ? "rounded-lg border border-slate-500 px-3 py-1 text-sm text-white bg-gray-950 hover:opacity-80"
            : "rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-900 bg-white hover:bg-slate-100";

    const linkClass =
        theme === "dark"
            ? "hover:text-gray-300"
            : "hover:text-slate-600";

    return (
        <div className={wrapperClass}>
            <button onClick={toggleTheme} className={buttonClass}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            {user ? (
                <>
                    <span>{user.username}</span>
                    <button onClick={logout} className={linkClass}>
                        Logout
                    </button>
                </>
            ) : (
                <Link to="/login" className={linkClass}>
                    Login
                </Link>
            )}
        </div>
    );
}