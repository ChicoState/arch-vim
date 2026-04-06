import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode } from "monaco-vim";

export default function VimEditor({
	value = "", //What appears in initial editor
	commands = [], //Commands needed to be used to pass
	finalText = null, //Solution text
	cursorLine = null, //Solution line number
	cursorCol = null, //Solution line column
	mode = null, //Solution mode (if they use the mode)
	height = "500px",
	width = "1000px",
	onWin = () => {}, //run when all win conditions are met (will set a flag in the level)
}){
	const editorRef = useRef(null);
	const vimModeRef = useRef(null);

	const currentModeRef = useRef("normal");
	const wonRef = useRef(false);
	//Checks win conditions
	function checkWinConditions() {
		if (wonRef.current) return;
		const editor = editorRef.current;
		if(!editor) return;

		if (finalText !== null) {
			const currentText = editor.getValue();
			if(currentText !== finalText) return;
		}

		if (cursorLine !== null || cursorCol !== null) {
			const pos = editor.getPosition();
			if (cursorLine !== null && pos.lineNumber !== cursorLine) return;
			if (cursorCol !== null && pos.column !== cursorCol) return;
		}

		if (mode !== null) {
			if (currentModeRef.current !== mode) return;
		}

		
	}

	function reset() {
		wonRef.current = false;
		currentModeRef.current = "normal";

		editorRef.current?.setValue(value);
	}

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
		statusNode.style.fontSize = "12px";
		editor.getDomNode().appendChild(statusNode);

		const vimMode = initVimMode(editor, statusNode);
		vimModeRef.current = vimMode;

		//Cursor line info at bottom
		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#1e1e1e";
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

	
	//Build text box and check button
	return(
		<Editor
		height = {height}
		width = {width}
		theme = "vs-dark"
		defaultLanguage="c"
		defaultValue={value}

		options = {{
			minimap: { enabled: false }
		}}
		onMount={handleMount}
		/>
	      );
}
