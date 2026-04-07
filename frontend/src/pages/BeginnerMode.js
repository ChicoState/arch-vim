import { Link } from "react-router-dom";

export default function BeginnerMode() {
  return (
    <div>
      <h1>Learn to Use Vim</h1>
        <ul>
            <li><Link to={`/levels/1`}>Level 1</Link> - Learn Navigation</li>
            <li><Link to={`/levels/2`}>Level 2</Link> - How to exit a vim file</li>
            <li><Link to={`/levels/3`}>Level 3</Link> - Insert Mode and typing</li>
            <li><Link to={`/levels/4`}>Level 4</Link> - How to save your changes</li>
            <li><Link to={`/levels/5`}>Level 5</Link> - Challenge!</li>      
        </ul>
    </div>
  );
}