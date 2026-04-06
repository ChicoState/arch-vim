import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";

export default function Level1() {
    //used to make the "You passed!"
    const [passed, setPassed] = useState(false);
    const startValue =
`#include <stdio.h>

int main() {
	printf("Hello World");
	return 0; 
}
`
    return (

// PAGE CONTENTS
      <div style={{ padding: "10px" }}>
        <h1>Level 1</h1>
        <h3>Learn how to navigate a file</h3>
        <p>By default, Vim uses the keys h, j, k, l for navigation in the editor.<br></br>
            <kbd>h</kbd> move left<br></br>
            <kbd>j</kbd> move down<br></br>
            <kbd>k</kbd> move up<br></br>
            <kbd>l</kbd> move right<br></br><br></br>
        Objective: Without using your arrow keys, move the cursor to Line 4, Column 15. {/* After 'Hello' */}
        </p>

{/* EDITOR IMPLEMENTATION */}
        <>
        <VimEditor
        value = {startValue}
        cursorCol={15}
        cursorLine={4}
        commands={[":w"]}
        onWin = {() => setPassed(true)}
        />
        {passed && (
            <div style={{
                marginTop: "20px",
                padding: "10px",
                background: "#1e1e1e",
                border: "1px solid #4caf50",
                borderRadius: "5px"
            }}>
        <h3 style={{ color: "#4caf50" }}>You passed!</h3>
        <p style = {{ color: "white" }}>
            Move on to the next level:
            <Link to="/levels/2" style={{ marginLeft: "8px", color: "#4caf50" }}>
                Level 2
            </Link>
        </p>
        <p style = {{ color: "white" }}>
            Or go back home:
            <Link to="/" style= {{ marginLeft: "8px"}}>
                Home
            </Link>
        </p>
    </div>
)}
		</>
      </div>  
    );
}