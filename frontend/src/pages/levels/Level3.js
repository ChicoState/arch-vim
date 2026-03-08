import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import VimEditor from "../../editor/vimEditor";
import { initVimMode } from "monaco-vim";
import Editor from "@monaco-editor/react";

export default function Level3() {
    const [passed, setPassed] = useState(false);
    const [enteredInsert, setEnteredInsert] = useState(false);
    const alreadyPassed = useRef(false);
     const [showEditor, setShowEditor] = useState(true);


    const starterText =
`// Level 3: INSERT MODE
// Press i to enter INSERT mode.
// Type VIM inside the brackets.
// Press Esc to go back to NORMAL mode.
//
// Objective: Put VIM inside [ ] below.

int main() {
  // Type here: [          ]
  return 0;
}
`;
;

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
			cursorPosNode.innerText = `Ln ${e.selection.positionLineNumber}, Col ${e.selection.positionColumn}`;
		});
	
		//Key logger (use for checking for certain key presses)
		editor.onKeyDown((e) => {
			console.log("Key pressed: ", e.browserEvent.key);
		});
	}

	//Editor saves to memory, checks against that
	function checkAnswer() {
		const expectedSolution = 
`function App() {
	return <h1> Goodbye React </h1> 
}`;
		const userCode = editorRef.current.getValue();
		console.log("User code: ", userCode);

		if(userCode.trim() === expectedSolution.trim()) {
			alert("Correct");
			//whatever else for correct
		} else {
			alert("Nope");
		}
	}
	//Build text box and check button
	return(
		<>
		<Editor
		height = "500px"
		width = "1000px"
		theme = "vs-dark"
		defaultLanguage="c" //This is for highlighting
		defaultValue=
{ //Code that appears on screen
`#include <stdio.h>

void main() {
	printf("Hello World");
	return 0; 
}`
}
		options = {{
			minimap: { enabled: false }
		}}
		onMount={handleMount}
		/>

		<button onClick={checkAnswer}>Check</button>
		</>
	      );

    function checkPassCondition(bufferText) {
        const hasVimInBrackets = /\[\s*VIM\s*\]/.test(bufferText);
        if (!alreadyPassed.current && enteredInsert && hasVimInBrackets) {
            alreadyPassed.current = true;
            setPassed(true);
            // hide editor (same style as Level 2)
            setShowEditor(false);
        }
    }

    function handleEditorKey(key) {
        // block arrow keys
        if (key === "ArrowUp" ||
            key === "ArrowDown" ||
            key === "ArrowLeft" ||
            key === "ArrowRight") {
            console.warn("Please don't use arrow keys.");
        }

        // detect insert attempts
        if (key === "i" || key === "a" || key === "o") {
            setEnteredInsert(true);
        }
    }

    return (
        <div className="level3" style={{ padding: "10px" }}>
            <div className="level_info">
                <h1>Level 3</h1>
                <h3>Insert Mode</h3>
                <p>
                    Press <b>i</b> to enter INSERT mode.<br />
                    Type <b>VIM</b> inside the brackets.<br />
                    Press <b>Esc</b> to return to NORMAL mode.<br /><br />
                    Objective: Put VIM inside [ ].
                </p>
            </div>

            <div className="editor">

                {showEditor ? (
                  <VimEditor
                        defaultLanguage="c"
                        defaultValue={starterText}
                        onKeyDown={(key) => handleEditorKey(key)}
                        onChange={(value) => checkPassCondition(value)}
                    />
                ) : (
                    <div style={{
                        marginTop: "20px",
                        padding: "10px",
                        background: "#1e1e1e",
                        border: "1px solid #4caf50",
                        borderRadius: "5px"
                    }}>
                        <h3 style={{ color: "#4caf50" }}>
                            You passed!
                        </h3>
                        <p style={{ color: "white" }}>
                            Move on to the next level:
                            <Link
                                to="/levels/4"
                                style={{ marginLeft: "8px", color: "#4caf50" }}
                            >
                                Level 4
                            </Link>
                        </p>
                        <p style={{ color: "white" }}>
                            Or go back home:
                            <Link
                                to="/"
                                style={{ marginLeft: "8px" }}
                            >
                                Home
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}