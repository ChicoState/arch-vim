import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";
import { write, read, reset } from "../../utils/session";

export default function Level4() {
    const [passed, setPassed] = useState(false);

    const editorRef = useRef(null);
    const vimModeRef = useRef(null);
    const saveKey = "level4_state";
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
        content: editorRef.current ? editorRef.current.getValue() : editorValue
        });
    };

    const handleLoad = () => {
        const saved = read(saveKey);
            if (!saved) return;
            setPassed(saved.passed ?? false);
            setEditorValue(saved.content ?? initialCode);
            setEditorKey((k) => k + 1);
    };

    const handleReset = () => {
        reset(saveKey);
        setPassed(false);
        setEditorValue(initialCode);
        setEditorKey((k) => k + 1);
    };


    function handleMount(editor, monaco) {
        <div style={{ marginBottom: "15px" }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleLoad} style={{ marginLeft: "8px" }}>Load</button>
            <button onClick={handleReset} style={{ marginLeft: "8px" }}>Reset</button>
        </div>
        editorRef.current = editor;
        const editorDom = editor.getDomNode();
        editorDom.style.position = "relative";

        const statusNode = document.createElement("div");
        statusNode.style.position = "absolute";
        statusNode.style.bottom = "0";
        statusNode.style.right = "50px";
        statusNode.style.background = "#1e1e1e";
        statusNode.style.fontSize = "12px";
        editor.getDomNode().appendChild(statusNode);

        const cursorPosNode = document.createElement("div");
        cursorPosNode.style.position = "absolute";
        cursorPosNode.style.bottom = "0";
        cursorPosNode.style.left = "35px";
        cursorPosNode.style.background = "#1e1e1e";
        cursorPosNode.style.fontSize = "12px";
        editor.getDomNode().appendChild(cursorPosNode);

        editor.onDidChangeCursorSelection(e => {
            const line = e.selection.positionLineNumber;
            const col = e.selection.positionColumn;
            cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
        });

        editor.onDidChangeModelContent(() => {
            setEditorValue(editor.getValue());
        });

        const vimMode = initVimMode(editor, statusNode);
        vimModeRef.current = vimMode;

        const { Vim } = vimMode.constructor;
        Vim.defineEx("write", "w", function() {
            setPassed(true);
        });

        editor.onKeyDown((e) => {
            const key = e.browserEvent.key;
            if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
                alert("Please don't use arrow keys");
            }
        });
    }

    return (
        <div style={{ padding: "10px" }}>
            <h1>Level 4</h1>
            <h3>How to save a file</h3>
            <p>After escaping, type <kbd>:w</kbd> and press Enter to save the file.<br />
                Objective: run the save command to pass.
            </p>
            
        <div style={{ marginBottom: "15px" }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleLoad} style={{ marginLeft: "8px" }}>Load</button>
            <button onClick={handleReset} style={{ marginLeft: "8px" }}>Reset</button>
        </div>

            <>
                <Editor
                    height="500px"
                    width="1000px"
                    options={{ minimap: { enabled: false } }}
                    onMount={handleMount}
                    theme="vs-dark"
                    defaultLanguage="c"
                    defaultValue={editorValue}
                    key={editorKey}
                />
                {passed && (
                    <div style={{
                        marginTop: "20px",
                        padding: "10px",
                        background: "#1e1e1e",
                        border: "1px solid #4caf50",
                        borderRadius: "5px"
                    }}>
                        <h3 style={{ color: "#4caf50" }}>You passed!</h3>
                        <p style={{ color: "white" }}>
                            Move on to the next level:
                            <Link to="/levels/5" style={{ marginLeft: "8px", color: "#4caf50" }}>Level 5</Link>
                        </p>
                        <p style={{ color: "white" }}>
                            Or go back home:
                            <Link to="/" style={{ marginLeft: "8px" }}>Home</Link>
                        </p>
                    </div>
                )}
            </>
        </div>
    );
}