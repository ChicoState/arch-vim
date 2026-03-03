import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";

export default function Level2() {

  //Passed Flag
  const [passed, setPassed] = useState(false);
  const editorRef = useRef(null);
	const vimModeRef = useRef(null);


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
		vimModeRef.current = initVimMode(editor, statusNode);

		//Cursor line info at bottom
		const cursorPosNode = document.createElement("div");
		cursorPosNode.style.position = "absolute";
		cursorPosNode.style.bottom = "0";
		cursorPosNode.style.left = "35px";
		cursorPosNode.style.background = "#1e1e1e";
		cursorPosNode.padding = "4px 8px";
		cursorPosNode.style.fontSize = "12px";

		editor.getDomNode().appendChild(cursorPosNode);
		
		editor.onDidChangeCursorSelection(e => {
			console.log("Cursor Info: ", e);
            const line = e.selection.positionLineNumber;
            const col = e.selection.positionColumn;
			cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
            //FOR CHECKING POSITION FOR THIS SPECIFIC LEVEL
            if(line === 4 && col === 15) setPassed(true);
		});
  }
  //Page Content
  return (
    <div class="level2" style={{ padding: "10px" }}>
      <div class="level_info">
        <h1>Level 2</h1>
        <h3>Learn how to exit a file</h3>
        <p>
          When starting with vim its not always clear how to exit
          <br />
          To open the console, press :
          <br />
          Typing ':q' will exit the vim editer
          <br />
          If you make an accidental change, and want to quit without saving, type ':q!'
          <br />
          <br />
          Objective: Simply Close the editor
        </p>
      </div>
      <div class="editor">
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
            
            void main() {
              printf("Hello World");
              return 0; 
            }
            `
          }
        />
      </div>
    </div>
  );
}
