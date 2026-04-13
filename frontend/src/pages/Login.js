import { useState } from 'react';
import { useAuth } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
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

    return (
        <div className="bg-gray-950">
            <div className="min-h-screen text-gray-200 flex flex-col justify-center items-center">
                <h1 className="text-center text-4xl mb-4">Login</h1>
                <div className="bg-gray-950 rounded-2xl p-6 text-gray-200 shadow-[0_0_5px_rgba(99,102,241,0.7)]">
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
                        <input
                            className="w-35 h-12 bg-gray-950 rounded-2xl p-6 text-gray-200 shadow-[0_0_5px_rgba(99,102,241,0.7)]"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input
                            className="w-35 h-12 bg-gray-950 rounded-2xl p-6 text-gray-200 shadow-[0_0_5px_rgba(99,102,241,0.7)]"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="submit" className="self-center pl-4 pr-4 pt-1 pb-1 rounded-xl text-centere bg-[rgb(63,64,150)]/100 trasnsition duration-200 hover:bg-[rgb(63,64,150)]/75 text-center">Login</button>
                    </form>
                    <p className="text-xs text-gray-400 text-center">Don't have an account? <Link to="/register" className="text-blue-400">Sign Up Here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;