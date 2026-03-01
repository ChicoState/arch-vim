import { Link } from "react-router-dom";

export default function Levels() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Levels</h1>
            <ul>
                <li><Link to={`/levels/1`}>Level 1</Link> - Learn Navigation</li>
                <li><Link to={`/levels/2`}>Level 2</Link> - Saving and Exiting</li>
                <li><Link to={`/levels/3`}>Level 3</Link> - Insert Mode and typing</li>
                <li><Link to={`/levels/4`}>Challenge!</Link></li>
            </ul>
        </div>
    );
}