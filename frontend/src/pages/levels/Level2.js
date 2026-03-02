
import { Link } from "react-router-dom";
import VimEditor from "../../editor/vimEditor";

export default function Level2() {
  return (
    <div style={{ padding: "10px" }}>
      <h1>Level 2</h1>
      <h3>Learn how to save and exit a file</h3>
      <p>
        When starting with vim its not always clear how to exit<br></br>
        To open the console, press : <br></br>
        Typing w will save the file, similar to ctrl+s <br></br>
        Typing q will exit the vim editer <br></br>
        These commands can be combined, so typing wq will save and quit the current editor <br></br><br></br>
        Objective: Make and save a couple changes, then close the editor
      </p>

      <VimEditor />
    </div>
  );
}
