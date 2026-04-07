import { Link } from "react-router-dom";

export default function AdvancedMode() {
  return (
    <div>
      <h1>Advanced Mode</h1>
        <ul>
            <li><Link to={`/levels/6`}>Level 6</Link> - Advanced Navigation</li>
            <li><Link to={`/levels/7`}>Level 7</Link> - Advanced Editing Techniques</li>
            <li><Link to={`/levels/8`}>Level 8</Link> - Customizing Vim</li>
            <li><Link to={`/levels/9`}>Level 9</Link> - Plugin Usage</li>
            <li><Link to={`/levels/10`}>Level 10</Link> - Challenge!</li>      
        </ul>
    </div>
  );
}