import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";

export default function Level4() {
    const [passed, setPassed] = useState(false);

    const editorRef = useRef(null);
	const vimModeRef = useRef(null);

	function handleMount(editor, monaco) {	
		editorRef.current = editor;
		const editorDom = editor.getDomNode();
		editorDom.style.position = "relative";
		
		const statusNode = document.createElement("div");
		statusNode.style.position = "absolute";
		statusNode.style.bottom = "0";
		statusNode.style.right = "50px";
		statusNode.style.background = "#1e1e1e";
		statusNode.padding = "4px 8px";
		statusNode.style.fontSize = "12px";
	
		editor.getDomNode().appendChild(statusNode);
		vimModeRef.current = initVimMode(editor, statusNode);
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
		});
	
		let vimCommand = "";
		editor.onKeyDown((e) => {
            const key = e.browserEvent.key;
			console.log("Key pressed: ", key);
            if(key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
                alert("Please don't use arrow keys");
            }

            if (key === ":") {
                vimCommand = ":";
            } else if (vimCommand) {
                if (key === "Backspace") {
                    vimCommand = vimCommand.slice(0, -1);
                } else if (key === "Enter") {
                    const cmd = vimCommand.trim();
                    if (cmd === ":w") {
                        setPassed(true);
                    }
                    vimCommand = "";
                } else {
                    vimCommand += key;
                }
                // limit buffer size
                if (vimCommand.length > 20) {
                    vimCommand = vimCommand.slice(-20);
                }
            }
		});
	}

    return (

      <div style={{ padding: "10px" }}>
        <h1>Level 4</h1>
        <h3>Learn how to save a file</h3>
        <p>After escaping, type <code>:w</code> and press Enter to save the file.<br></br>
            
        Objective: run the save command (<code>:w</code>) to pass.<nobr>{/* After 'Hello' */}</nobr>
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
		defaultLanguage="c"
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
            <Link to="/levels/5" style={{ marginLeft: "8px", color: "#4caf50" }}>
                Level 5
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
