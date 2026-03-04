import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import { initVimMode } from "monaco-vim";

export default function VimEditor(props) {
//props
    const {
        height = "500px",
        width = "1000px",
        defaultLanguage = "c",
        defaultValue = "",
        onChange, //value, editor
        onKeyDown, //key, e, editor
        onVimInit, //vimMode, editor
        onManualCheck, //level decides pass/fail
        showButtons = true,
        options = {}
    } = props;

    const editorRef = useRef(null);
    const vimModeRef = useRef(null);

    useEffect(() => {

        return () => {
            //dispose vim mode if it exists
            if (vimModeRef.current && vimModeRef.current.dispose) {
                vimModeRef.current.dispose();
            }

        };

    }, []);

//buttons
    function handleReset() {
        if (!editorRef.current) return;
        editorRef.current.setValue(defaultValue);
    	editorRef.current.focus();
    }

    function handleClear() {
        if (!editorRef.current) return;
        editorRef.current.setValue("");
        editorRef.current.focus();
    }

    function handleCheck() {
        if (!editorRef.current) return;
        if (!onManualCheck) return;
        const value = editorRef.current.getValue();
        onManualCheck(value, editorRef.current);
        editorRef.current.focus();
    }

    function handleMount(editor, monaco) {
		editorRef.current = editor;
        const editorDom = editor.getDomNode();
        editorDom.style.position = "relative";

//vim status and mode
        const statusNode = document.createElement("div");
        statusNode.style.position = "absolute";
        statusNode.style.bottom = "0";
        statusNode.style.right = "50px";
        statusNode.style.background = "#1e1e1e";
        statusNode.style.padding = "4px 8px";
        statusNode.style.fontSize = "12px";
        statusNode.style.color = "#ddd";
        editorDom.appendChild(statusNode);
        vimModeRef.current = initVimMode(editor, statusNode);
        if (onVimInit) {
            onVimInit(vimModeRef.current, editor);
        }

//cursor position status
        const cursorPosNode = document.createElement("div");
        cursorPosNode.style.position = "absolute";
        cursorPosNode.style.bottom = "0";
        cursorPosNode.style.left = "35px";
        cursorPosNode.style.background = "#1e1e1e";
        cursorPosNode.style.padding = "4px 8px";
        cursorPosNode.style.fontSize = "12px";
        cursorPosNode.style.color = "#ddd";
        editorDom.appendChild(cursorPosNode);
        editor.onDidChangeCursorSelection((e) => {
            const line = e.selection.positionLineNumber;
            const col  = e.selection.positionColumn;
            cursorPosNode.innerText = `Ln ${line}, Col ${col}`;
        });

//text changes finder
        editor.onDidChangeModelContent(() => {
            if (!onChange) return;
            const value = editor.getValue();
            onChange(value, editor);
        });

//keydown hook
        editor.onKeyDown((e) => {
            if (!onKeyDown) return;
            const key = e.browserEvent.key;
            onKeyDown(key, e, editor);
        });
    }

//render editor
    return (
		<div>
            {showButtons && (
                <div style={{
                    marginBottom: "10px",
                    display: "flex",
                    gap: "10px"
                }}>
                    <button onClick={handleReset}>
                        Reset
                    </button>
                    <button onClick={handleClear}>
                        Clear
                    </button>
                    {onManualCheck && (
                        <button onClick={handleCheck}>
                            Check
                        </button>
                    )}
                </div>
            )}

        <Editor
            height={height}
            width={width}
            theme="vs-dark"
            defaultLanguage={defaultLanguage}
            defaultValue={defaultValue}
            options={{
                minimap: { enabled: false },
                ...options
            }}
            onMount={handleMount}
            />
        </div>
    );
}