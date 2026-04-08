import { Link } from "react-router-dom";
import { useState } from "react";
import VimEditor from "../../editor/vimEditor";

export default function Level5() {
  const [passed, setPassed] = useState(false);
  const defaultValue=`#include <stdio.h>

int main() {
  printf("Hello World");
  return 0; 
}
`
  const finalValue=`#include <stdio.h>

int main() {
  printf("Hello Vim");
  return 0; 
}
`

  return (
    <div style={{ padding: "10px" }}>
      <h1>Challenge level</h1>
        <h3>Combine all the skills you've learned to complete the objective!</h3>
        <p>
          Objective: Change <kbd>Hello World</kbd>to <kbd>Hello Vim</kbd>then save and quit
        </p>
       <ul className="key-list">
          <li>Hint: You can combine <kbd>:w</kbd> and <kbd>:q</kbd> into <kbd>:wq</kbd> to Save and Quit</li>
          <li>Hint 2: You need to be in Normal mode to use <kbd>:</kbd>commands</li>
        </ul>
      <VimEditor
      value = {defaultValue}
      finalText = {finalValue}
      possibleCommands = {[":q", ":wq"]}
      onWin={() => setPassed(true)}
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