import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import { vimCommands } from "./vimCommands.js";
import { saveProgress, loadProgress } from "../progress.js";
import { useTheme } from "../ThemeContext.js";
import { useProgress } from "../components/checkLevelPassed.js"

/*			Editor Usage
Parameters - 
	level: Level number for backend
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
	level = 0,
	value = "", //What appears in initial editor
	commands = [], //Commands needed to be used to pass
	possibleCommands = [], //Commands where at least 1 needs to be used (:q vs :wq)
	keystrokes = [],
	finalText = null, //Solution text
	finalTextContains = null, //Solution, checks if final text has something rather than checking entire thing
	finalTextRegex = null, //Solution, lets you search final text using regex
	cursorLine = null, //Solution line number
	cursorCol = null, //Solution line column
	mode = null, //Solution mode (if they use the mode)
	// normal, visual, insert, replace (defaults to normal, so prob don't need to do that)
	height = "560px",
	width = "1100px",
	onWin = () => {}, //run when all win conditions are met (will set a flag in the level)
	//MUST HAVE THE onWin = {() => setWin(true)} as a param, and you can use setWin for the react state: const [win, setWin] = useState(false);
	className = "",

	//More params to help with rendering just text using it
	showResetLevel = true,
	showStatusNodes = true,
	showLineNumbers = "on", //can also use 'relative', but meant to turn them off with "off"
	defaultLang = "c",
	moreOptions = {}, //consult the sacred texts: https://blutorange.github.io/primefaces-monaco/typedoc/interfaces/monaco.editor.ieditorconstructionoptions.html
	canWin = true,
}) {
	const editorRef = useRef(null);
	const vimModeRef = useRef(null);
	const { theme } = useTheme();

	const editorTheme = theme === "dark" ? "vs-dark" : "vs";
	const editorBoxClass =
		theme === "dark"
			? "bg-gray-950 text-gray-200 shadow-[0_0_18px_rgba(99,102,241,0.7)] rounded-xl overflow-hidden"
			: "bg-white text-slate-900 shadow-[0_0_22px_rgba(99,102,241,0.35)] border border-indigo-200 rounded-xl overflow-hidden";
	const resetButtonClass =
		theme === "dark"
			? "mt-5 px-8 py-4 rounded-2xl bg-indigo-600 !text-white text-xl font-bold shadow-[0_0_14px_rgba(99,102,241,0.45)] transition duration-200 hover:bg-indigo-500"
			: "mt-5 px-8 py-4 rounded-2xl bg-indigo-600 !text-white text-xl font-bold shadow-[0_0_18px_rgba(99,102,241,0.32)] transition duration-200 hover:bg-indigo-500";




	const currentModeRef = useRef("normal");
	const wonRef = useRef(false);

	const calledCommandsRef = useRef(
		Object.fromEntries(commands.map((cmd) => [cmd, false]))
	);

	const calledPossibleCommandsRef = useRef(
		Object.fromEntries(possibleCommands.map((cmd) => [cmd, false]))
	);

	const { levelPassed } = useProgress();

	async function saveTest() {
		const existing = await loadProgress();
		await saveProgress({
			...existing,
			[`level_${level}`]: { passed: true }
		});
		levelPassed(level);
		onWin();
	}

	function checkWinConditions() {
		if(!canWin) return;
		if (wonRef.current) return;
		const editor = editorRef.current;
		if (!editor) return;

		if (finalText !== null) {
			const currentText = editor.getValue();
			if (currentText !== finalText) return;
		}

		if (finalTextRegex !== null) {
			const currentText = editor.getValue();
			if (!finalTextRegex.test(currentText)) return;
		}

		if (finalTextContains !== null) {
			const currentText = editor.getValue();
			if (!currentText.includes(finalTextContains)) return;
		}

		if (cursorLine !== null || cursorCol !== null) {
			const pos = editor.getPosition();
			if (cursorLine !== null && pos.lineNumber !== cursorLine) return;
			if (cursorCol !== null && pos.column !== cursorCol) return;
		}

		if (mode !== null) {
			if (currentModeRef.current !== mode) return;
		}
		
		//if all are true (used), return true
		//if at least 1 is false, return false
		
		const allCommandsUsed = commands.every(
			(cmd) => calledCommandsRef.current[cmd] === true
		);
		if (!allCommandsUsed) return;

		//For checking if a single command from the list is used
		//Want to find a single one that returns true
		//so inverse the previous one
		//if all are false (none are used), return true
		//if at least 1 is used, return false
		// 			empty array always returns true

		if (possibleCommands.length > 0) {
			const aCommandUsed = possibleCommands.every(
				(cmd) => calledPossibleCommandsRef.current[cmd] === false
			);
			//inverse back (aka don't use the !)
			if (aCommandUsed) return;
		}

		if(keystrokes.length !== 0) return;

		wonRef.current = true;
		saveTest();
	}

	function reset() {
		wonRef.current = false;
		currentModeRef.current = "normal";
		calledCommandsRef.current = Object.fromEntries(
			commands.map((cmd) => [cmd, false])
		);
		calledPossibleCommandsRef.current = Object.fromEntries(
			possibleCommands.map((cmd) => [cmd, false])
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
		statusNode.style.background = "#111827";
		statusNode.style.color = "#ffffff";
		statusNode.style.fontSize = "12px";
		statusNode.style.padding = "2px 8px";
		statusNode.style.borderRadius = "6px";


		const vimMode = initVimMode(editor, statusNode);
		vimModeRef.current = vimMode;
		//Cursor line info at bottom

		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#111827";
		cursorPosNode.style.color = "#ffffff";
		cursorPosNode.style.fontSize = "12px";
		cursorPosNode.style.padding = "2px 8px";
		cursorPosNode.style.borderRadius = "6px";

		if(showStatusNodes) {
			editor.getDomNode().appendChild(statusNode);
			editor.getDomNode().appendChild(cursorPosNode);
		}
		//attempt at not allowing arrow keys
		//() => {} didn't work so trying other stuff

		editor.addCommand(monaco.KeyCode.UpArrow, function () {});

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

			VimMode.Vim.defineEx(name, abbrev, () => {
				//if the command is in the commands param
				if (fullCmd in calledCommandsRef.current) {
					calledCommandsRef.current[fullCmd] = true;
				}
				if (fullCmd in calledPossibleCommandsRef.current) {
					calledPossibleCommandsRef.current[fullCmd] = true;
				}
				checkWinConditions();
			});
		});

		//true just watching the statusNode with an eventListening, but it wasnt working
		const observer = new MutationObserver(() => {
			const modeText = statusNode.innerText.toLowerCase();
			currentModeRef.current = modeText.includes("insert")
				? "insert"
				: modeText.includes("visual")
				? "visual"
				: modeText.includes("replace")
				? "replace"
				: "normal";
			checkWinConditions();
		});
		//								child elements, all descendents, text changes

		observer.observe(statusNode, {
			childList: true,
			subtree: true,
			characterData: true
		});
		//also theres a onDidChangeCursorPosition, but if we ever want to watch the selection as well, we need this

		editor.onDidChangeCursorSelection((e) => {
			cursorPosNode.innerText = `Ln ${e.selection.positionLineNumber}, Col ${e.selection.positionColumn}`;
			checkWinConditions();
		});

		//watches changes in model content
		editor.onDidChangeModelContent(() => {
			checkWinConditions();
		});

		//Key logger (use for checking for certain key presses)
		editor.onKeyDown((e) => {
			const key = e.browserEvent.key;
			console.log("Key pressed: ", key);
			//Check if the keys in this have been pressed, if so, remove them (for not : commands)
			const index = keystrokes.indexOf(key);
			if (index !== -1) {
				  keystrokes.splice(index, 1);
			}
			checkWinConditions();
		});
	}

	//Build text box and check button
	return (
		<div className={`w-full flex flex-col items-center ${className}`}>
				<div className="w-full flex justify-center">
					<Editor
						className={editorBoxClass}
						height={height}
						width={width}
						theme={editorTheme}
						defaultLanguage={defaultLang}
						defaultValue={value}
						options={{
							lineNumbers: showLineNumbers,
							minimap: { enabled: false },
							...moreOptions
						}}
						onMount={handleMount}
					/>
				</div>
				{ showResetLevel &&
				<button
					className={resetButtonClass}
					onClick={reset}
				>
					Reset Level
				</button> }
			</div>
	);
}