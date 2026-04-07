import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";
import { initVimMode, VimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";
import { write, read, reset } from "../../utils/session";

let onWriteQuit = null;
let done = false;

VimMode.Vim.defineEx("wq", "wq", (_cm, params) => {
  const bang = params?.argString?.trim() === "!";
  if (onWriteQuit) onWriteQuit({ bang });
  done = true;
});

const Level15 = () => {
  const editorRef = useRef(null);
  const vimModeRef = useRef(null);

  const storageKey = "level-15";
  const starterCode = `// Level 15`;

  const [code, setCode] = useState(() => read(storageKey) || starterCode);

  useEffect(() => write(storageKey, code), [code]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    vimModeRef.current = initVimMode(editor, document.getElementById("vim-status"));
  };

  useEffect(() => () => vimModeRef.current?.dispose(), []);

  const handleReset = () => {
    reset(storageKey);
    setCode(starterCode);
  };

  return (
    <div>
      <Link to="/levels">Back</Link>
      <h1>Level 6</h1>
      <button onClick={handleReset}>Reset</button>

      <VimEditor>
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          value={code}
          onChange={(v) => setCode(v || "")}
          onMount={handleEditorDidMount}
        />
      </VimEditor>

      <div id="vim-status" />
    </div>
  );
};

export default Level15;