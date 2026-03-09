import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { initVimMode,VimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";


let onQuit = null;
let onWrite = null;
let onWriteQuit = null;

VimMode.Vim.defineEx("write", "w", (_cm, params) => {
  const arg = params?.argString?.trim();
  const bang = arg === "!";
  if (onWrite) onWrite({ bang });
});

VimMode.Vim.defineEx("wq", "wq", (_cm, params) => {
  const arg = params?.argString?.trim();
  const bang = arg === "!";
  if (onWriteQuit) onWriteQuit({ bang });
});

// keep your quit
VimMode.Vim.defineEx("quit", "q", (_cm, params) => {
  if (params && (params.line != null || params.lineEnd != null)) return;
  const arg = params?.argString?.trim();
  const bang = arg === "!";
  if (onQuit) onQuit({ bang });
});

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
    return hasGW && (pressedWRef.current || pressedWQRef.current) && pressedEscRef.current;
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
          Objective: Change Hello World to Goodbye World, and save
        </p>
       <ul className="key-list">
          <li><kbd>Esc</kbd> Return to NORMAL mode</li>
          <li><kbd>i</kbd> Enter INSERT mode</li>
          <li><kbd>:w</kbd> Save</li>
          <li><kbd>:wq</kbd> Save and Quit</li>
        </ul>

      <Editor
        height="500px"
        width="1000px"
        options={{ minimap: { enabled: false } }}
        onMount={handleMount}
        theme="vs-dark"
        defaultLanguage="c"
        defaultValue={
`#include <stdio.h>

int main() {
  printf("Hello World");
  return 0; 
}
`
      }
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
            No more levels
            {/* <Link to="/levels/4" style={{ marginLeft: "8px", color: "#4caf50" }}>
              Level 4
            </Link> */}
          </p>

          <p style={{ color: "white" }}>
            Or go back home:
            <Link to="/" style={{ marginLeft: "8px",  color: "#d54622" }}>
              Home
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
// import { Link } from "react-router-dom";
// import VimEditor from "../../editor/vimEditor"

// export default function Level1() {
//     return (
//       <div>
//         <h1>Challenge Level!</h1>
//         <h3>Combine all the skills you've learned to complete the objective!</h3>
//         <p>Objective: Change Hello World to Goodbye World, and save.</p>
//         <VimEditor />
//       </div>  
//     );
// // }
// import { useNavigate, Link } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { useRef, useState, useEffect } from "react";
// import { initVimMode, VimMode} from "monaco-vim";

// //vim command to be used
// let onQuit = null;
// let onWrite = null;
// let onWriteQuit = null;


// //defineEx, defines a global command
// //_cm contains command called, params contains any charactars after like !
// VimMode.Vim.defineEx("quit", "q", (_cm, params) => {
//   //if command countains line info before/ after command, it doesn't exit.
//   if (params && (params.line != null || params.lineEnd != null)) return;// just ignore invalid form

//   //if ! is present, bang is set to true
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   //if the handler 'onQuit' is installed, call the function and pass it bang
//   if (onQuit) onQuit({ bang });
// });
// VimMode.Vim.map("jk", "<Esc>", "insert");
// //write command
// VimMode.Vim.defineEx("write", "w", (_cm, params) => {
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   if (onWrite) onWrite({ bang });
// }); 
// //writeQuit command
// VimMode.Vim.defineEx("wq", "wq", (_cm, params) => {
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   if (onWriteQuit) onWriteQuit({ bang });
// });
// //Creates a Nav bar for this level, which alows for safe closing of the editor, before navigation.
// function Level5Nav({ safeClosePromise }) {
//   const navigate = useNavigate();

//   const go = (to) => async (e) => {
//     e.preventDefault();          // stop immediate navigation
//     await safeClosePromise();      // wait for close to finish
//     navigate(to);                // now navigate
//   };

//   return (
//     <nav>
//       <Link to="/" onClick={go("/")}>Home</Link> |{" "}
//       <Link to="/levels" onClick={go("/levels")}>Levels</Link>
//     </nav>
//   );
// }

// export default function Level5() {
//   const [statusMsg, setStatusMsg] = useState("");
//   const [savedOnce, setSavedOnce] = useState(false); // any successful :w or :wq
//   const [dirty, setDirty] = useState(false);         // changed since last save
//   const [useSafeNav, setUseSafeNav] = useState(true); // safe nav while editor is open

//   //Flag used to close editor on quit
//   const [showEditor, setShowEditor] = useState(true);

//   const editorRef = useRef(null);
// 	const vimModeRef = useRef(null);

//   //constants used for cleanup
//   const disposables = useRef([]);
//   const statusNodeRef = useRef(null);
//   const cursorNodeRef = useRef(null);

//   //Implements Handlers for console commands
//   useEffect(() => {
//     //Hide app Navbar to allow for one that closes editor before leaving page.
//     document.body.classList.add("hide-global-nav");

//        onWrite = () => {
//     const code = editorRef.current?.getValue?.() ?? "";
//     if (!hasWinMessage(code)) {
//       setStatusMsg(' Not saved: change "Hello World" to "Goodbye World" first.');
//       return;
//     }
//     setSavedOnce(true);
//     setDirty(false);
//     setStatusMsg(" Saved (:w)");
//   };

//   onWriteQuit = () => {
//     const code = editorRef.current?.getValue?.() ?? "";
//     if (!hasWinMessage(code)) {
//       setStatusMsg(' Not saved: change "Hello World" to "Goodbye World" first.');
//       return;
//     }
//     setSavedOnce(true);
//     setDirty(false);
//     setStatusMsg(" Saved and quit (:wq)");
//     // close editor + switch navbar back
//     setUseSafeNav(false);
//     document.body.classList.remove("hide-global-nav");
//     safeClose();
//   };

//   onQuit = () => {
//     // if they never saved, or changes since last save, don't close
//     if (!savedOnce || dirty) {
//       setStatusMsg(' No save yet. Use :w to save, or :wq to save and quit.');
//       return;
//     }
//     // allow quit only after a successful save and no unsaved changes
//     setStatusMsg("Quit (:q)");
//     setUseSafeNav(false);
//     document.body.classList.remove("hide-global-nav");
//     safeClose();
//   };

//   return () => {
//     onQuit = null;
//     onWrite = null;
//     onWriteQuit = null;

//     document.body.classList.remove("hide-global-nav");
//     vimModeRef.current?.dispose?.();

//     for (const d of disposables.current) d?.dispose?.();
//   };
// }, [savedOnce, dirty]);

//   function hasWinMessage(code = ""){
//     //accepting minor whitespaces
//     const hasGoodbye = /printf\s*\(\s*"\s*Goodbye World(?:\\n)?\s*"\s*\)\s*;/i.test(code);
//     const stillHasHello = /Hello World/i.test(code);
//     return hasGoodbye && !stillHasHello;
//   }



//   function safeClose() {
//     //stop monaco-vim
//     vimModeRef.current?.dispose?.();
//     vimModeRef.current = null;

//     //stops monaco listeners
//     for(const d of disposables.current) {
//       d?.dispose?.();
//     }
//     disposables.current = [];

//     //removes added nodes(status/cursor)
//     statusNodeRef.current?.remove?.();
//     cursorNodeRef.current?.remove?.();
//     statusNodeRef.current = null;
//     cursorNodeRef.current = null;

//     setTimeout(() => setShowEditor(false), 50);
//   }

//   const safeClosePromise = () =>
//     new Promise((resolve) => {
//       safeClose();          // your existing close that triggers teardown
//       setTimeout(resolve, 50); // SAME delay you already know works
//     });

//   function handleMount(editor, monaco) {	
// 		editorRef.current = editor;
// 		const editorDom = editor.getDomNode();
// 		editorDom.style.position = "relative";
//     //enabling Escape
//     // const escDisp = editor.onKeyDown((e) => {
//     // if (e.browserEvent.key === "Escape") {
//     //   e.preventDefault();
//     //   e.stopPropagation();
//     // }
//     // });
//     // disposables.current.push(escDisp);

//     // vimModeRef.current = initVimMode(editor, statusNode);


		
// 		//Vim current mode at bottom
//     //-------------
// 		// const statusNode = document.createElement("div");
// 		// statusNode.style.position = "absolute";
// 		// statusNode.style.bottom = "0";
// 		// statusNode.style.right = "50px";
// 		// statusNode.style.background = "#1e1e1e";
// 		// statusNode.style.padding = "4px 8px";
// 		// statusNode.style.fontSize = "12px";
	
// 		// editor.getDomNode().appendChild(statusNode);
//     // statusNodeRef.current = statusNode;

// 		// vimModeRef.current = initVimMode(editor, statusNode);
    

// 		// //Cursor line info at bottom
// 		// const cursorPosNode = document.createElement("div");
// 		// cursorPosNode.style.position = "absolute";
// 		// cursorPosNode.style.bottom = "0";
// 		// cursorPosNode.style.left = "35px";
// 		// cursorPosNode.style.background = "#1e1e1e";
// 		// cursorPosNode.style.padding = "4px 8px";
// 		// cursorPosNode.style.fontSize = "12px";
//     // cursorNodeRef.current = cursorPosNode;
//     //---------------
//   // status node
//   const statusNode = document.createElement("div");
//   statusNode.style.position = "absolute";
//   statusNode.style.bottom = "0";
//   statusNode.style.right = "50px";
//   statusNode.style.background = "#1e1e1e";
//   statusNode.style.padding = "4px 8px";
//   statusNode.style.fontSize = "12px";
//   statusNode.style.zIndex = "1000";
//   statusNode.style.pointerEvents = "none";
//   editorDom.appendChild(statusNode);
//   statusNodeRef.current = statusNode;

//   // cursor node
//   const cursorPosNode = document.createElement("div");
//   cursorPosNode.style.position = "absolute";
//   cursorPosNode.style.bottom = "0";
//   cursorPosNode.style.left = "35px";
//   cursorPosNode.style.background = "#1e1e1e";
//   cursorPosNode.style.padding = "4px 8px";
//   cursorPosNode.style.fontSize = "12px";
//   cursorPosNode.style.zIndex = "1000";
//   cursorPosNode.style.pointerEvents = "none";
//   editorDom.appendChild(cursorPosNode);
//   cursorNodeRef.current = cursorPosNode;

//   // ensure single vim instance
//   vimModeRef.current?.dispose?.();
//   vimModeRef.current = initVimMode(editor, statusNode);

//   // cursor updates



//     //Key logger (use for checking for certain key presses)
// 		editor.onKeyDown((e) => {
//             const key = e.browserEvent.key;
// 			console.log("Key pressed: ", key);
//             if(key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
//                 alert("Please don't use arrow keys");
//             }
// 		});
	

// 		const cursorDisp = editor.onDidChangeCursorSelection(e => {
// 			console.log("Cursor Info: ", e);
//       const line = e.selection.positionLineNumber;
//       const col = e.selection.positionColumn;
// 			cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
// 		});
//     editor.getDomNode().appendChild(cursorPosNode);

//     disposables.current.push(cursorDisp);
//     // let vim receive Escape
//   const escDisp = editor.onKeyDown((e) => {
//     if (e.browserEvent.key === "Escape") {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//   });
//   disposables.current.push(escDisp);

//   // re-attach nodes if Monaco rebuilds DOM
//   const obs = new MutationObserver(() => {
//     const root = editor.getDomNode();
//     if (!root) return;
//     if (statusNodeRef.current && !root.contains(statusNodeRef.current)) root.appendChild(statusNodeRef.current);
//     if (cursorNodeRef.current && !root.contains(cursorNodeRef.current)) root.appendChild(cursorNodeRef.current);
//   });
//   obs.observe(editorDom, { childList: true, subtree: true });
//   disposables.current.push({ dispose: () => obs.disconnect() });
//   }
//   //Page Content
//   return (
    
//     <div className="level5" >
//       {useSafeNav ? (
//         <Level5Nav safeClosePromise={safeClosePromise} />
//       ) : (
//         <nav style={{ padding: 10 }}>
//           <Link to="/">Home</Link> | <Link to="/levels">Levels</Link>
//         </nav>
//       )}
//       <div className="level_info" style={{ padding: "10px" }}>
//         <h1>Challenge level</h1>
//         <h3>Combine all the skills you've learned to complete the objective!</h3>
//         <p>
//           Objective: Change Hello World to Goodbye World, and save
//         </p>
//       </div>
//       <div className="editor">
//         { showEditor ? (
//           <>
//         <Editor
//           height = "500px"
//           width = "1000px"
//           options = {{
//             minimap: { enabled: false }
//           }}

//           onMount={handleMount}
//           onChange={() => {
//           setDirty(true);
//           // clear “saved” message when editing again
//           setStatusMsg("");
//           }}
//           theme = "vs-dark"
//           defaultLanguage="c" //This is for highlighting
//           defaultValue=
//           { //Default code that appears on editor
// `#include <stdio.h>

// int main() {
//   printf("Hello World");
//   return 0; 
// }
// `
//           }
//           />
//           {statusMsg && (
//     <div style={{ marginTop: 10, padding: 10 }}>
//       {statusMsg}
//     </div>
//   )}
//   </>
//           ) : (

//               //Displayed when editor is closed/exitted
//             <div style={{
//               marginTop: "20px",
//               padding: "10px",
//               background: "#1e1e1e",
//               border: "1px solid #4caf50",
//               borderRadius: "5px"
//               }}>
//               <h3 style={{ color: "#4caf50" }}>You passed!</h3>
//               <p style = {{ color: "white" }}>
//                   Move on to the next level: Not active, practice level 5 again.
//                   <Link to="/levels/5" style={{ marginLeft: "8px", color: "#4caf50" }}>
//                     level 5
//                   </Link>
//               </p>
//               <p style = {{ color: "white" }}>
//                   Or go back home:
//                   <Link to="/" style= {{ marginLeft: "8px"}}>
//                     Home
//                   </Link>
//               </p>
//           </div>
//         )}
//       </div>
        
//     </div>
//   );
// }
