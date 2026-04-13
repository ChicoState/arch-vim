import { AuthProvider, useAuth } from '../AuthContext.js';
import { Link } from "react-router-dom";

export default function Login() {
  const { user, logout } = useAuth();
  return(
    <nav id="home-login">
    {user ? (
      <>
      <span>{user.username}</span> {" | "}
      <button onClick={logout}>Logout</button>
      </>
    ) : (
      <Link to="/login">Login</Link>
    )}
    </nav>
  )
}
