import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode } from "monaco-vim";

export default function VimEditor(){
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
`void main() {
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
}
