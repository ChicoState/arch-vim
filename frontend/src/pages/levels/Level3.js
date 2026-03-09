import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";

export default function Level3() {
  const [passed, setPassed] = useState(false);
  const [saved, setSaved] = useState(false);

  //track the expected sequence: press i (enter insert), type, press Esc (back to normal)
  const [pressedI, setPressedI] = useState(false);
  const [pressedEsc, setPressedEsc] = useState(false);

  const editorRef = useRef(null);
  const vimModeRef = useRef(null);
  const postedRef = useRef(false);

  async function postCompleteOnce() {
    if (postedRef.current) return;
    postedRef.current = true;

    try {
      const res = await fetch("http://localhost:8000/api/levels/3/complete/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passed: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) setSaved(true);
    } catch (e) {
      console.error("Failed to save Level 3 completion:", e);
      postedRef.current = false; //allow retry if server was down
    }
  }

  function checkWinCondition(code) {
    const hasVimInBrackets = /\[\s*VIM\s*\]/.test(code);
    return hasVimInBrackets && pressedI && pressedEsc;
  }

  function handleMount(editor) {
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

    //cursor info
    const cursorPosNode = document.createElement("div");
    cursorPosNode.style.position = "absolute";
    cursorPosNode.style.bottom = "0";
    cursorPosNode.style.left = "35px";
    cursorPosNode.style.background = "#1e1e1e";
    cursorPosNode.padding = "4px 8px";
    cursorPosNode.style.fontSize = "12px";
    editor.getDomNode().appendChild(cursorPosNode);

    editor.onDidChangeCursorSelection((e) => {
      const line = e.selection.positionLineNumber;
      const col = e.selection.positionColumn;
      cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
    });

    //watch keystrokes
    editor.onKeyDown((e) => {
      const key = e.browserEvent.key;

      if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
        alert("Please don't use arrow keys");
      }
      if (key === "i" && !passed) setPressedI(true);
      if (key === "Escape" && !passed) setPressedEsc(true);
    });

    const updateEscFromStatus = () => {
      const t = (statusNode.innerText || "").toUpperCase();
      if (t.includes("NORMAL")) setPressedEsc(true);
    };

    const observer = new MutationObserver(() => {
      if (!passed) updateEscFromStatus();
    });

    observer.observe(statusNode, { childList: true, characterData: true, subtree: true });

    //check win condition
    editor.onDidChangeModelContent(() => {
      if (passed) return;

      updateEscFromStatus();
      const code = editor.getValue();
      if (checkWinCondition(code)) {
        setPassed(true);
        observer.disconnect();
        postCompleteOnce();
      }
    });

    editor.onDidDispose(() => observer.disconnect());
  }

  return (
    <div style={{ padding: "10px" }}>
      <h1>Level 3</h1>
      <h3>Insert Mode</h3>
      <p>
        Press <b>i</b> to enter INSERT mode.<br />
        Type <b>VIM</b> inside the brackets.<br />
        Press <b>Esc</b> to return to NORMAL mode.<br />
        <br />
        Objective: Put VIM inside <b>[ ]</b>.
      </p>

      <Editor
        height="500px"
        width="1000px"
        options={{ minimap: { enabled: false } }}
        onMount={handleMount}
        theme="vs-dark"
        defaultLanguage="c"
        defaultValue={`// Put VIM inside the brackets:
[   ]
`}
      />

      {passed && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#1e1e1e",
            border: "1px solid #4caf50",
            borderRadius: "5px",
          }}
        >
          <h3 style={{ color: "#4caf50" }}>You passed!</h3>

          <p style={{ color: "white" }}>
            Saved on server:{" "}
            <span style={{ color: saved ? "#4caf50" : "orange" }}>
              {saved ? "Yes" : "Trying..."}
            </span>
          </p>

          <p style={{ color: "white" }}>
            Move on to the next level:
            <Link to="/levels/4" style={{ marginLeft: "8px", color: "#4caf50" }}>
              Level 4
            </Link>
          </p>

          <p style={{ color: "white" }}>
            Or go back home:
            <Link to="/" style={{ marginLeft: "8px" }}>
              Home
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}