import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode } from "monaco-vim";

export default function VimEditor(){
	const editorRef = useRef(null);
	const vimModeRef = useRef(null);

	function handleMount(editor, monaco) {	
		editorRef.current = editor;

		const statusNode = document.createElement("div");
		statusNode.style.position = "absolute";
		statusNode.style.bottom = "0";
		statusNode.style.right = "150px";
		statusNode.style.background = "#1e1e1e";
		statusNode.padding = "4px 8px";
		statusNode.style.fontSize = "12px";
	
		editor.getDomNode().appendChild(statusNode);
		vimModeRef.current = initVimMode(editor, statusNode);


		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.right = "250px";
		cursorPosNode.style.background = "#1e1e1e";
		cursorPosNode.padding = "4px 8px";
		cursorPosNode.style.fontSize = "12px";

		editor.getDomNode().appendChild(cursorPosNode);

		
		editor.onDidChangeCursorSelection(e => {
			console.log("Cursor line: ", e.selection.positionLineNumber);
			console.log("Cursor Column: ", e.selection.positionColumn);
			cursorPosNode.innerText = `Ln ${e.selection.positionLineNumber}, Col ${e.selection.positionColumn}`;
		});
	

		editor.onKeyDown((e) => {
			console.log("Key pressed: ", e.browserEvent.key);
		});
	}

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

	return(
		<>
		<Editor
		height = "500px"
		width = "1000px"
		theme = "vs-dark"
		defaultLanguage="javascript" //This is for highlighting
		defaultValue=
{ //Code that appears on screen
`function App() {
	return <h1> Hello React </h1> 
}`
}
		onMount={handleMount}
		/>

		<button onClick={checkAnswer}>Check</button>
		</>
	      );
}
