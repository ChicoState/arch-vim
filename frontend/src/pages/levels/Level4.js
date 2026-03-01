import { Link } from "react-router-dom";
import VimEditor from "../../editor/vimEditor"

export default function Level1() {
    return (
      <div>
        <h1>Challenge Level!</h1>
        <h3>Combine all the skills you've learned to complete the objective!</h3>
        <p>Objective: Change Hello World to Goodbye World, and save.</p>
        <VimEditor />
      </div>  
    );
}