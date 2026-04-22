import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import { vimCommands } from "./vimCommands.js";
import { saveProgress, loadProgress } from "../progress.js";
import { useTheme } from "../ThemeContext.js";

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
	value = "",
	commands = [],
	possibleCommands = [],
	finalText = null,
	finalTextContains = null,
	finalTextRegex = null,
	cursorLine = null,
	cursorCol = null,
	mode = null,
	height = "560px",
	width = "1100px",
	onWin = () => {},
	className = "",
}) {
	const editorRef = useRef(null);
	const vimModeRef = useRef(null);
	const { theme } = useTheme();
	const editorTheme = theme === "dark" ? "vs-dark" : "vs";

	const currentModeRef = useRef("normal");
	const wonRef = useRef(false);

	const calledCommandsRef = useRef(
		Object.fromEntries(commands.map((cmd) => [cmd, false]))
	);

	const calledPossibleCommandsRef = useRef(
		Object.fromEntries(possibleCommands.map((cmd) => [cmd, false]))
	);

	async function saveTest() {
		const existing = await loadProgress();
		await saveProgress({
			...existing,
			[`level_${level}`]: { passed: true }
		});
		onWin();
	}

	function checkWinConditions() {
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

		const allCommandsUsed = commands.every(
			(cmd) => calledCommandsRef.current[cmd] === true
		);
		if (!allCommandsUsed) return;

		if (possibleCommands.length > 0) {
			const aCommandUsed = possibleCommands.every(
				(cmd) => calledPossibleCommandsRef.current[cmd] === false
			);
			if (aCommandUsed) return;
		}

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

		const statusNode = document.createElement("div");
		statusNode.style.position = "absolute";
		statusNode.style.bottom = "0";
		statusNode.style.right = "50px";
		statusNode.style.background = "#111827";
		statusNode.style.color = "#ffffff";
		statusNode.style.fontSize = "12px";
		statusNode.style.padding = "2px 8px";
		statusNode.style.borderRadius = "6px";
		editor.getDomNode().appendChild(statusNode);

		const vimMode = initVimMode(editor, statusNode);
		vimModeRef.current = vimMode;

		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#111827";
		cursorPosNode.style.color = "#ffffff";
		cursorPosNode.style.fontSize = "12px";
		cursorPosNode.style.padding = "2px 8px";
		cursorPosNode.style.borderRadius = "6px";
		editor.getDomNode().appendChild(cursorPosNode);

		editor.addCommand(monaco.KeyCode.UpArrow, function () {});

		Object.entries(vimCommands).forEach(([name, abbrev]) => {
			const fullCmd = `:${abbrev}`;

			VimMode.Vim.defineEx(name, abbrev, () => {
				if (fullCmd in calledCommandsRef.current) {
					calledCommandsRef.current[fullCmd] = true;
				}
				if (fullCmd in calledPossibleCommandsRef.current) {
					calledPossibleCommandsRef.current[fullCmd] = true;
				}
				checkWinConditions();
			});
		});

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

		observer.observe(statusNode, {
			childList: true,
			subtree: true,
			characterData: true
		});

		editor.onDidChangeCursorSelection((e) => {
			cursorPosNode.innerText = `Ln ${e.selection.positionLineNumber}, Col ${e.selection.positionColumn}`;
			checkWinConditions();
		});

		editor.onDidChangeModelContent(() => {
			checkWinConditions();
		});

		editor.onKeyDown(() => {
			checkWinConditions();
		});
	}

	return (
		<div className={`w-full flex flex-col items-center ${className}`}>
			<div className="w-full flex justify-center">
				<Editor
					className="bg-gray-950 text-gray-200 shadow-[0_0_18px_rgba(99,102,241,0.7)] rounded-xl overflow-hidden"
					height={height}
					width={width}
					theme={editorTheme}
					defaultLanguage="c"
					defaultValue={value}
					options={{
						minimap: { enabled: false }
					}}
					onMount={handleMount}
				/>
			</div>

			<button
				className="mt-5 px-6 py-3 rounded-xl bg-indigo-600 text-white text-base font-semibold shadow-[0_0_14px_rgba(99,102,241,0.45)] transition duration-200 hover:bg-indigo-500"
				onClick={reset}
			>
				Reset Level
			</button>
		</div>
	);
}