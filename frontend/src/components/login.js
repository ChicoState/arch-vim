import { AuthProvider, useAuth } from '../AuthContext.js';
import { Link } from "react-router-dom";

export default function Login() {
  const { user, logout } = useAuth();
  return(
    <nav id="home-login">
    {user ? (
      <>
      <span>{user.username}</span> {" | "}
      <button onClick={logout} className="hover:text-gray-400">Logout</button>
      </>
    ) : (
      <Link to="/login" className="hover:text-gray-400">Login</Link>
    )}
    </nav>
  )
}
