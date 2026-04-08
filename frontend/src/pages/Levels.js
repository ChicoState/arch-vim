import { Link } from "react-router-dom";

export default function Levels() {
  return (
    <div>
      <h1>Mode Select</h1>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <Link to="/levels/beginner">
          <button>Beginner Mode</button>
        </Link>

        <Link to="/levels/advanced">
          <button>Advanced Mode</button>
        </Link>

        <Link to="/levels/expert">
          <button>Expert Mode</button>
        </Link>
      </div>
    </div>
  );
}