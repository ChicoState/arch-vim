import { useState } from 'react';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import ThemeToggle from "../components/themeToggle";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch {
            setError('Invalid username or password');
        }
    };

    const pageClass =
        theme === "dark"
            ? "bg-gray-950 min-h-screen"
            : "bg-slate-50 min-h-screen";

    const wrapperClass =
        theme === "dark"
            ? "min-h-screen text-gray-200 flex flex-col justify-center items-center px-6"
            : "min-h-screen text-slate-900 flex flex-col justify-center items-center px-6";

    const cardClass =
        theme === "dark"
            ? "w-full max-w-md bg-gray-950 rounded-3xl p-8 text-gray-200 shadow-[0_0_20px_rgba(99,102,241,0.7)]"
            : "w-full max-w-md bg-white rounded-3xl p-8 text-slate-900 border border-slate-200 shadow-[0_0_24px_rgba(99,102,241,0.18)]";

    const inputClass =
        theme === "dark"
            ? "w-full h-14 bg-gray-900 rounded-2xl px-5 text-lg text-gray-100 border border-gray-700 shadow-[0_0_8px_rgba(99,102,241,0.2)] outline-none focus:border-indigo-400 focus:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
            : "w-full h-14 bg-white rounded-2xl px-5 text-lg text-slate-900 border border-slate-300 outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]";

    const buttonClass =
        theme === "dark"
            ? "w-full mt-2 py-3 rounded-2xl bg-indigo-600 transition duration-200 hover:bg-indigo-500 text-center !text-white text-lg font-semibold shadow-[0_0_14px_rgba(99,102,241,0.35)]"
            : "w-full mt-2 py-3 rounded-2xl bg-indigo-600 transition duration-200 hover:bg-indigo-500 text-center !text-white text-lg font-semibold shadow-[0_0_18px_rgba(99,102,241,0.22)]";

    const helperTextClass =
        theme === "dark"
            ? "text-base text-gray-400 text-center mt-5"
            : "text-base text-slate-500 text-center mt-5";

    const linkClass =
        theme === "dark"
            ? "text-blue-400 hover:text-blue-300 font-semibold"
            : "text-indigo-600 hover:text-indigo-700 font-semibold";

    const errorClass =
        theme === "dark"
            ? "mb-4 text-sm text-red-400 text-center"
            : "mb-4 text-sm text-red-600 text-center";

    return (
        <div className={pageClass}>
            <div className="fixed right-5 top-5 z-50">
                <ThemeToggle />
            </div>

            <div className={wrapperClass}>
                <h1 className="text-center text-7xl font-bold mb-8">Login</h1>

                <div className={cardClass}>
                    {error && <p className={errorClass}>{error}</p>}

                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                        <input
                            className={inputClass}
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />

                        <input
                            className={inputClass}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button type="submit" className={buttonClass}>
                            Login
                        </button>
                    </form>

                    <p className={helperTextClass}>
                        Don't have an account?{" "}
                        <Link to="/register" className={linkClass}>
                            Sign Up Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;