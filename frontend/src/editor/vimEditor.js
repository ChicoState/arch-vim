import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import { vimCommands } from "./vimCommands.js"


/*			Editor Usage
Parameters - 
	value: What is intially shown on the editor
	height: Height of editor in px (default 500)
	width: Width of editor in px (default 1000)

	Win Condition Params -
		commands: List of commands that must be used to pass the level
		finalText: String containing what should be in the editor to pass
		cursorLine: Final line position for cursor
		cursorCol: Final column position for cursor
		mode: Vim Mode check for passing (must be in this mode to pass)

	onWin = {() => setWin(true)}: used for react state, passes true once all win conditions are passed. Used for every level

Implementation -
	<VimEditor
	[any combo of parameters]
	onWin = {() => setWin(true)}
	/>
*/

export default function VimEditor({
	value = "", //What appears in initial editor
	commands = [], //Commands needed to be used to pass
	finalText = null, //Solution text
	cursorLine = null, //Solution line number
	cursorCol = null, //Solution line column
	mode = null, //Solution mode (if they use the mode)
	// normal, visual, insert, replace (defaults to normal, so prob don't need to do that)
	height = "500px",
	width = "1000px",
	onWin = () => {}, //run when all win conditions are met (will set a flag in the level)
	//MUST HAVE THE onWin = {() => setWin(true)} as a param, and you can use setWin for the react state: const [win, setWin] = useState(false);
}){
	const editorRef = useRef(null);
	const vimModeRef = useRef(null);

	const currentModeRef = useRef("normal");
	const wonRef = useRef(false);


	const calledCommandsRef = useRef(
			Object.fromEntries(commands.map((cmd) => [cmd, false]))
		);

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

		//can also edit this so that if it EVER sees whats in mode, then good to go
		if (mode !== null) {
			if (currentModeRef.current !== mode) return;
		}

		const allCommandsUsed = commands.every(
			(cmd) => calledCommandsRef.current[cmd] === true
		);
		if(!allCommandsUsed) return;

		wonRef.current = true;
		onWin();
	}

	function reset() {
		wonRef.current = false;
		currentModeRef.current = "normal";
		calledCommandsRef.current = Object.fromEntries(
			commands.map((cmd) => [cmd, false])
		);
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

		//Makes all given commands to:

		//VimMode.Vim.defineEx("write", "w", (cm, input) => {
		//	calledCommandsRef.current[":w"] = true;
		//  checkWinConditions();
		//});

		Object.entries(vimCommands).forEach(([name, abbrev]) => {

			//adds the : to the front
			//so when you type in the commands into the commands = {[]} param, you need to add :
			//ex: commands = {[":w", ":q"]}
			const fullCmd = `:${abbrev}`;
			
			VimMode.Vim.defineEx(name, abbrev, (cm, input) => {
				//if the command is in the commands param
				if (fullCmd in calledCommandsRef.current) {
					calledCommandsRef.current[fullCmd] = true;
				}
				checkWinConditions();
			});
		});

		//true just watching the statusNode with an eventListening, but it wasnt working
		const observer = new MutationObserver(() => {
			const modeText = statusNode.innerText.toLowerCase();
			currentModeRef.current = modeText.includes("insert") ? "insert"
									:modeText.includes("visual") ? "visual"
									:modeText.includes("replace")? "replace"
									:"normal";
			checkWinConditions();
		})
		//								child elements, all descendents, text changes
		observer.observe(statusNode, { childList: true, subtree: true, characterDate: true})
		
		//also theres a onDidChangeCursorPosition, but if we ever want to watch the selection as well, we need this
		editor.onDidChangeCursorSelection(e => {
			console.log("Cursor Info: ", e);
			cursorPosNode.innerText = `Ln ${e.selection.positionLineNumber}, Col ${e.selection.positionColumn}`;
			checkWinConditions(); //called because line position changed
		});

		//watches changes in model content
		editor.onDidChangeModelContent(() => {
			checkWinConditions();
		})
	
		//Key logger (use for checking for certain key presses)
		editor.onKeyDown((e) => {
			console.log("Key pressed: ", e.browserEvent.key);
		});
	}

	
	//Build text box and check button
	return(
		<>
		<button onClick={reset}>Reset Level</button>
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
		</>
	);
}
