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
		statusNode.style.right = "10px";
		statusNode.style.background = "#1e1e1e";
		statusNode.color = "white";
		statusNode.padding = "4px 8px";
		statusNode.style.fontSize = "12px";
	
		editor.getDomNode().appendChild(statusNode);

		vimModeRef.current = initVimMode(editor, statusNode);

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
		defaultLanguage="javascript" //This is for highlighting
		defaultValue=
{ //Code that appears on screen
`function App() {
	return <h1> Hello React </h1> 




	awdadwad
}`
}
		onMount={handleMount}
		/>

		<button onClick={checkAnswer}>Check</button>
		</>
	      );
}
