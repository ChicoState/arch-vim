import { Link } from "react-router-dom";

export default function ExpertMode() {
  return (
    <div>
      <h1>Expert Mode</h1>
        <ul>
            <li><Link to={`/levels/11`}>Level 11</Link> - Expert Navigation</li>
            <li><Link to={`/levels/12`}>Level 12</Link> - Expert Editing Techniques</li>
            <li><Link to={`/levels/13`}>Level 13</Link> - Customizing Vim</li>
            <li><Link to={`/levels/14`}>Level 14</Link> - Plugin Usage</li>
            <li><Link to={`/levels/15`}>Level 15</Link> - Challenge!</li>      
        </ul>
    </div>
  );
}