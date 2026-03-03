import { Link } from "react-router-dom";

export default function Levels() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Levels</h1>
            <ul>
                <li><Link to={`/levels/1`}>Level 1</Link> - Learn Navigation</li>
                <li><Link to={`/levels/2`}>Level 2</Link> - How to exit a vim file</li>
                <li><Link to={`/levels/3`}>Level 3</Link> - Insert Mode and typing</li>
                <li><Link to={`/levels/4`}>Level 4</Link> - How to save your changes</li>
                <li><Link to={`/levels/5`}>Challenge!</Link></li>
            </ul>
        </div>
    );
}