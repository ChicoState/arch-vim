import { useState } from 'react';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";

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
            ? "bg-gray-950"
            : "bg-slate-50";

    const wrapperClass =
        theme === "dark"
            ? "min-h-screen text-gray-200 flex flex-col justify-center items-center"
            : "min-h-screen text-slate-900 flex flex-col justify-center items-center";

    const cardClass =
        theme === "dark"
            ? "bg-gray-950 rounded-2xl p-6 text-gray-200 shadow-[0_0_5px_rgba(99,102,241,0.7)]"
            : "bg-white rounded-2xl p-6 text-slate-900 border border-slate-200 shadow-[0_10px_30px_rgba(99,102,241,0.15)]";

    const inputClass =
        theme === "dark"
            ? "w-35 h-12 bg-gray-950 rounded-2xl p-6 text-gray-200 shadow-[0_0_5px_rgba(99,102,241,0.7)]"
            : "w-35 h-12 bg-white rounded-2xl p-6 text-slate-900 border border-slate-300";

    const buttonClass =
        theme === "dark"
            ? "self-center pl-4 pr-4 pt-1 pb-1 rounded-xl text-centere bg-[rgb(63,64,150)]/100 trasnsition duration-200 hover:bg-[rgb(63,64,150)]/75 text-center text-white"
            : "self-center pl-4 pr-4 pt-1 pb-1 rounded-xl text-center bg-indigo-600 transition duration-200 hover:bg-indigo-500 text-white";

    const helperTextClass =
        theme === "dark"
            ? "text-xs text-gray-400 text-center"
            : "text-xs text-slate-500 text-center";

    const linkClass =
        theme === "dark"
            ? "text-blue-400"
            : "text-indigo-600 hover:text-indigo-700";

    return (
        <div className={pageClass}>
            <div className={wrapperClass}>
                <h1 className="text-center text-4xl mb-4">Login</h1>
                <div className={cardClass}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
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
                        <button type="submit" className={buttonClass}>Login</button>
                    </form>
                    <p className={helperTextClass}>Don't have an account? <Link to="/register" className={linkClass}>Sign Up Here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;