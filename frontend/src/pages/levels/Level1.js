import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";

export default function Level1() {
    //used to make the "You passed!"
    const [passed, setPassed] = useState(false);

    const editorRef = useRef(null);
	const vimModeRef = useRef(null);

	function handleMount(editor, monaco) {	
		editorRef.current = editor;
		const editorDom = editor.getDomNode();
		editorDom.style.position = "relative";
		
		//Vim current mode at bottom
		const statusNode = document.createElement("div");
		statusNode.style.position = "absolute";
		statusNode.style.bottom = "0";
		statusNode.style.right = "50px";
		statusNode.style.background = "#1e1e1e";
		statusNode.padding = "4px 8px";
		statusNode.style.fontSize = "12px";
	
		editor.getDomNode().appendChild(statusNode);
		vimModeRef.current = initVimMode(editor, statusNode);

		//Cursor line info at bottom
		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#1e1e1e";
		cursorPosNode.padding = "4px 8px";
		cursorPosNode.style.fontSize = "12px";

		editor.getDomNode().appendChild(cursorPosNode);
		
		editor.onDidChangeCursorSelection(e => {
			console.log("Cursor Info: ", e);
            const line = e.selection.positionLineNumber;
            const col = e.selection.positionColumn;
			cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
            //FOR CHECKING POSITION FOR THIS SPECIFIC LEVEL
            if(line === 4 && col === 15) setPassed(true);
		});
	
		//Key logger (use for checking for certain key presses)
		editor.onKeyDown((e) => {
            const key = e.browserEvent.key;
			console.log("Key pressed: ", key);
            if(key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
                alert("Please don't use arrow keys");
            }
		});
	}

    return (

// PAGE CONTENTS
      <div style={{ padding: "10px" }}>
        <h1>Level 1</h1>
        <h3>Learn how to navigate a file</h3>
        <p>By default, Vim uses the keys h, j, k, l for navigation in the editor.<br></br>
            h -> move left<br></br>
            j -> move down<br></br>
            k -> move up<br></br>
            l -> move right<br></br><br></br>
        Objective: Without using your arrow keys, move the cursor to Line 4, Column 15. {/* After 'Hello' */}
        </p>

{/* EDITOR IMPLEMENTATION */}
        <>
		<Editor
		height = "500px"
		width = "1000px"
        options = {{
			minimap: { enabled: false }
		}}
		onMount={handleMount}
		theme = "vs-dark"
		defaultLanguage="c" //This is for highlighting
		defaultValue=
{ //Default code that appears on editor
`#include <stdio.h>

void main() {
	printf("Hello World");
	return 0; 
}
`
}
        />
        {/* Check button. Thinking about changing this to an automatic thing that fires when the cursor gets to those spots, rather than waiting to press the check button */}
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