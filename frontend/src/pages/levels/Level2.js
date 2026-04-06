import { useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { initVimMode, VimMode} from "monaco-vim";

//used to include quit
let onQuit = null;


//defineEx, defines a global command
//_cm contains command called, params contains any charactars after like !
// VimMode.Vim.defineEx("quit", "q", (_cm, params) => {

  
//   //if command countains line info before/ after command, it doesn't exit.
//   if (params && (params.line != null || params.lineEnd != null)) {
//     // just ignore invalid form
//     return;
//   }

//   //if ! is present, bang is set to true
//   const arg = params?.argString?.trim();
//   const bang = arg === "!";
//   //if the handler 'onQuit' is installed, call the function and pass it bang
//   if (onQuit) onQuit({ bang });
// });

//Creates a Nav bar for this level, which alows for safe closing of the editor, before navigation.
function Level2Nav({ safeClosePromise }) {
  const navigate = useNavigate();

  const go = (to) => async (e) => {
    e.preventDefault();          // stop immediate navigation
    await safeClosePromise();      // wait for close to finish
    navigate(to);                // now navigate
  };

  return (
    <nav>
      <Link to="/" onClick={go("/")}>Home</Link> |{" "}
      <Link to="/levels" onClick={go("/levels")}>Levels</Link>
    </nav>
  );
}

export default function Level2() {

  //Flag used to close editor on quit
  const [showEditor, setShowEditor] = useState(true);

  const editorRef = useRef(null);
	const vimModeRef = useRef(null);

  //constants used for cleanup
  const disposables = useRef([]);
  const statusNodeRef = useRef(null);
  const cursorNodeRef = useRef(null);

  //Implements Handlers for console commands
  useEffect(() => {
    //Hide app Navbar to allow for one that closes editor before leaving page.
    document.body.classList.add("hide-global-nav");

    //iplements onQuit function
    onQuit = ({ bang }) => {

      //currently q! and q do the same thing since write isn't implemented.
      safeClose();
    };
    // code to run when this component unmounts.
    // Since the quit vim command is a global
    // onQuit is set to null since the setShowEditor is not defined on other levels
    //
    return () => {
      onQuit = null;
      document.body.classList.remove("hide-global-nav");
      vimModeRef.current?.dispose?.();
      for(const d in disposables.current) {
        d?.dispose?.();
      }
    };
  }, []);

  function safeClose() {
    //stop monaco-vim
    vimModeRef.current?.dispose?.();
    vimModeRef.current = null;

    //stops monaco listeners
    for(const d in disposables.current) {
      d?.dispose?.();
    }
    disposables.current = [];

    //removes added nodes(status/cursor)
    statusNodeRef.current?.remove?.();
    cursorNodeRef.current?.remove?.();
    statusNodeRef.current = null;
    cursorNodeRef.current = null;

    setTimeout(() => setShowEditor(false), 50);
  }

  const safeClosePromise = () =>
    new Promise((resolve) => {
      safeClose();          // your existing close that triggers teardown
      setTimeout(resolve, 50); // SAME delay you already know works
    });

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
    statusNodeRef.current = statusNode;

		vimModeRef.current = initVimMode(editor, statusNode);
    

		//Cursor line info at bottom
		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#1e1e1e";
		cursorPosNode.padding = "4px 8px";
		cursorPosNode.style.fontSize = "12px";
    cursorNodeRef.current = cursorPosNode;

		const cursorDisp = editor.onDidChangeCursorSelection(e => {
			console.log("Cursor Info: ", e);
      const line = e.selection.positionLineNumber;
      const col = e.selection.positionColumn;
			cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
		});
    editor.getDomNode().appendChild(cursorPosNode);

    disposables.current.push(cursorDisp);
  }
  //Page Content
  return (
    
    <div class="level2" >
      <Level2Nav safeClosePromise={safeClosePromise} />
      <div class="level_info" style={{ padding: "10px" }}>
        <h1>Level 2</h1>
        <h3>Learn how to exit a file</h3>
        <p>
          When starting with vim its not always clear how to exit
          <br />
          To open the console, press <kbd>:</kbd>
          <br />
          Typing <kbd>:q</kbd> will exit the vim editer
          <br />
          If you make an accidental change, and want to quit without saving, type <kbd>:q!</kbd>
          <br />
          <br />
          Objective: Simply Close the editor
        </p>
      </div>
      <div class="editor">
        { showEditor ? (
        <Editor
          height = "500px"
          width = "1000px"
          options = {{
            minimap: { enabled: false }
          }}

          onMount={handleMount}
          theme = "vs-dark"
          defaultLanguage="c" //This is for highlighting
          defaultValue=
          { //Default code that appears on editor
`#include <stdio.h>

int main() {
  printf("Hello World");
  return 0; 
}
`
          }
        />
          ) : (

              //Displayed when editor is closed/exitted
            <div style={{
              marginTop: "20px",
              padding: "10px",
              background: "#1e1e1e",
              border: "1px solid #4caf50",
              borderRadius: "5px"
              }}>
              <h3 style={{ color: "#4caf50" }}>You passed!</h3>
              <p style = {{ color: "white" }}>
                  Move on to the next level:
                  <Link to="/levels/3" style={{ marginLeft: "8px", color: "#4caf50" }}>
                    Level 3
                  </Link>
              </p>
              <p style = {{ color: "white" }}>
                  Or go back home:
                  <Link to="/" style= {{ marginLeft: "8px"}}>
                    Home
                  </Link>
              </p>
          </div>
        )}
      </div>
        
    </div>
  );
}