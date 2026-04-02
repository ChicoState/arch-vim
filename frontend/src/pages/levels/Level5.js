import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { initVimMode,VimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";
import { write, read, reset } from "../../utils/session";


let onQuit = null;
let onWrite = null;
let onWriteQuit = null;
let done = false;

// VimMode.Vim.defineEx("write", "w", (_cm, params) => {
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   if (onWrite) onWrite({ bang });
//   done = true;
// });

VimMode.Vim.defineEx("wq", "wq", (_cm, params) => {
  const arg = params?.argString?.trim();
  const bang = arg === "!";
  if (onWriteQuit) onWriteQuit({ bang });
  done = true;
});

// keep your quit
// VimMode.Vim.defineEx("quit", "q", (_cm, params) => {
//   if (params && (params.line != null || params.lineEnd != null)) return;
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   if (onQuit) onQuit({ bang });
//   done = true;
// });

export default function Level5() {
  const [passed, setPassed] = useState(false);
  const [saved, setSaved] = useState(false);

  //track the expected sequence: press i (enter insert), type, press Esc (back to normal)
  const [pressedI, setPressedI] = useState(false);
  const [pressedEsc, setPressedEsc] = useState(false);

  const pressedIRef = useRef(false);
  const pressedEscRef = useRef(false);
  const pressedWRef = useRef(false)
  const pressedWQRef = useRef(false)


  const editorRef = useRef(null);
  const vimModeRef = useRef(null);
  const postedRef = useRef(false);
  const saveKey = "level5_state";
  const initialCode = `#include <stdio.h>
  int main() {
      printf("Hello World");
      return 0; 
  }
  `;

  const [editorValue, setEditorValue] = useState(initialCode);
  const [editorKey, setEditorKey] = useState(0);
  const handleSave = () => {
    write(saveKey, {
      passed,
      saved,
      pressedI,
      pressedEsc,
      content: editorRef.current ? editorRef.current.getValue() : editorValue
    });
  };

  const handleLoad = () => {
  const loaded = read(saveKey);
    if (!loaded) return;
    setPassed(loaded.passed ?? false);
    setSaved(loaded.saved ?? false);
    setPressedI(loaded.pressedI ?? false);
    setPressedEsc(loaded.pressedEsc ?? false);
    pressedIRef.current = loaded.pressedI ?? false;
    pressedEscRef.current = loaded.pressedEsc ?? false;
    setEditorValue(loaded.content ?? initialCode);
    setEditorKey((k) => k + 1);
  };

  const handleReset = () => {
    reset(saveKey);
    setPassed(false);
    setSaved(false);
    setPressedI(false);
    setPressedEsc(false);
    pressedIRef.current = false;
    pressedEscRef.current = false;
    pressedWRef.current = false;
    pressedWQRef.current = false;
    done = false;
    setEditorValue(initialCode);
    setEditorKey((k) => k + 1);
  };

  // inside Level3() component, after your refs/state
useEffect(() => {
  // hook up Ex command handlers to component logic
  onWrite = ({ bang } = {}) => {
    const code = editorRef.current?.getValue?.() ?? "";
    if (!/printf\s*\(\s*"\s*Goodbye World(?:\\n)?\s*"\s*\)\s*;/.test(code)) {
      // show visual feedback (you can setStatusMsg if you add one)
      console.warn("Not saved: change Hello World to Goodbye World first.");
      return;
    }

    // mark that we have saved (but not quit)
    setSaved(true);
    // mark state so checkWinCondition can use it (if you'd like)
    pressedWRef.current = true;
    console.log("Saved (:w)");
  };

  onWriteQuit = ({ bang } = {}) => {
    const code = editorRef.current?.getValue?.() ?? "";
    if (!/printf\s*\(\s*"\s*Goodbye World(?:\\n)?\s*"\s*\)\s*;/.test(code)) {
      console.warn("Not saved: change Hello World to Goodbye World first.");
      return;
    }

    // mark saved and that write+quit happened
    setSaved(true);
    pressedWQRef.current = true;
    console.log("Saved and quitting (:wq)");

    // treat :wq as the final action: require Esc/Normal as well
    if (pressedEscRef.current) {
      setPassed(true);
      postCompleteOnce();
      // optionally close editor UI here if you do that
    } else {
      console.log("Still waiting for Esc/Normal mode to be entered.");
    }
  };

  onQuit = ({ bang } = {}) => {
    // if user tries :q without a successful save, show message only
    if (!saved) {
      console.warn("No save yet. Use :w to save, or :wq to save and quit.");
      return;
    }
    // if already saved, you could allow quitting (close UI), or require Esc
    if (!pressedEscRef.current) {
      console.warn("Please return to NORMAL mode (Esc) before quitting.");
      return;
    }

    // final quit action: mark passed if already satisfied
    if (checkWinCondition(editorRef.current?.getValue?.() ?? "")) {
      setPassed(true);
      postCompleteOnce();
    }
  };

  // cleanup on unmount
  return () => {
    onWrite = null;
    onWriteQuit = null;
    onQuit = null;
  };
}, [saved]); // include saved so onQuit can check current saved state

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
    const hasGW = /printf\s*\(\s*"\s*Goodbye World(?:\\n)?\s*"\s*\)\s*;/.test(code);
    return (hasGW && done && pressedEscRef.current);
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
    statusNode.style.padding = "4px 8px";
    statusNode.style.fontSize = "12px";
    editor.getDomNode().appendChild(statusNode);

    vimModeRef.current = initVimMode(editor, statusNode);

    //cursor info
    const cursorPosNode = document.createElement("div");
    cursorPosNode.style.position = "absolute";
    cursorPosNode.style.bottom = "0";
    cursorPosNode.style.left = "35px";
    cursorPosNode.style.background = "#1e1e1e";
    cursorPosNode.style.padding = "4px 8px";
    cursorPosNode.style.fontSize = "12px";
    editor.getDomNode().appendChild(cursorPosNode);

    editor.onDidChangeCursorSelection((e) => {
      const line = e.selection.positionLineNumber;
      const col = e.selection.positionColumn;
      cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
    });
    
    editor.onDidChangeModelContent(() => {
      setEditorValue(editor.getValue());
    });

    //watch keystrokes
    editor.onKeyDown((e) => {
      const key = e.browserEvent.key;

      if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
        alert("Please don't use arrow keys");
      }
      if (key === "i" && !passed) {
        pressedIRef.current = true;
        setPressedI(true);
      }
      if (key === "w" && !passed) {
        pressedWRef.current = true;
      }
      if (key === "wq" && !passed) {
        pressedWQRef.current = true;
      }
      if (key === "Escape" && !passed) {
        pressedEscRef.current = true;
        setPressedEsc(true);
      }
    });

    const updateEscFromStatus = () => {
      const t = (statusNode.innerText || "").toUpperCase();
      if (t.includes("NORMAL")) {
        pressedEscRef.current = true;
        setPressedEsc(true);
      }
    };

    const observer = new MutationObserver(() => {
      if (passed) return;
      updateEscFromStatus();
      const code = editor.getValue();
      if (checkWinCondition(code)) {
        setPassed(true);
        observer.disconnect();
        postCompleteOnce();
      }
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
      <h1>Challenge level</h1>
        <h3>Combine all the skills you've learned to complete the objective!</h3>
        <p>
          Objective: Change <kbd> Hello World</kbd> to<kbd> Goodbye World</kbd> then save and quit
        </p>
       <ul className="key-list">
          <li>Hint: You can combine <kbd>:w</kbd> and <kbd>:q</kbd> into <kbd>:wq</kbd> to Save and Quit</li>
          <li>Hint 2: You need to be in Normal mode to use <kbd>:</kbd>commands</li>
        </ul>

    <div style={{ marginBottom: "15px" }}>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLoad} style={{ marginLeft: "8px" }}>Load</button>
      <button onClick={handleReset} style={{ marginLeft: "8px" }}>Reset</button>
    </div>

      <Editor
        height="500px"
        width="1000px"
        options={{ minimap: { enabled: false } }}
        onMount={handleMount}
        theme="vs-dark"
        defaultLanguage="c"
        key={editorKey}
        defaultValue={editorValue}
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
            Thats all, folks!
            {/* <Link to="/levels/4" style={{ marginLeft: "8px", color: "#4caf50" }}>
              Level 4
            </Link> */}
          </p>

          <p style={{ color: "white" }}>
            Back home:
            <Link to="/" style={{ marginLeft: "8px",  color: "#d54622" }}>
              Home
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}