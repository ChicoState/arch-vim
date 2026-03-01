import { Link } from "react-router-dom";
import VimEditor from "../../editor/vimEditor"

export default function Level1() {
    //watch keystrokes for i, or watch mode change to insert
    //
    //Something like this:
    //vimModeRef.current.on('modeChange', (mode) => {
    //  console.log("Vim mode:", mode.mode);
    //});
    return (
      <div>
        <h1>Level 3</h1>
        <p>Insert Mode</p>
        <VimEditor />
      </div>  
    );
}