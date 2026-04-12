import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";

export default function Level3() {
  const levelNum = 3
  const [passed, setPassed] = useState(false);

  const defaultValue=`// Put VIM inside the brackets:
[   ]
`
    useEffect(() => {
        loadProgress().then(
            data=>{
                if (data[`level_${levelNum}`]?.passed) 
                    setPassed(true);
                });
            }, []);

  return (
    <div style={{ padding: "10px" }}>
      <h1>Level 3</h1>
      <h3>Insert Mode</h3>
      <p>
        Vim has multiple modes which allow for different actions to be taken. So far, you have been in what is called "Normal" mode, which is where most commands are used.<br></br>
        Normal mode is the default mode of the Vim editor, but it can always be returned to from other modes by pressed your <kbd>esc</kbd>key. Your current mode is listed on the bottom right of the editor.<br></br><br></br>
        In this level, you will use what is called "Insert" mode. <br></br>
        Insert mode is the mode that allows you to actually type!<br></br><br></br>
        Press <kbd>i</kbd> to enter INSERT mode.<br />
        Type <b>VIM</b> inside the brackets.<br />
        Press <kbd>Esc</kbd> to return to NORMAL mode.<br />
        <br />
        Objective: Put VIM inside <b>[ ]</b>.
      </p>

      <VimEditor
      level={levelNum}
      value = {defaultValue}
      finalTextRegex = {/\[\s*VIM\s*\]/}
      mode={"normal"}
      onWin={() => {setPassed(true)}}
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