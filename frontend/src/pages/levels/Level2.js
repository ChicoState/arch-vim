import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";

export default function Level2() {
  const levelNum = 2
  const [passed, setPassed] = useState(false);
  const startValue =
`#include <stdio.h>

int main() {
	printf("Hello World");
	return 0; 
}
`
    useEffect(() => {
        loadProgress().then(
            data=>{
                if (data[`level_${levelNum}`]?.passed) 
                    setPassed(true);
                });
            }, []);


  return (
    <>
      <div class="level_info" style={{ textAlign: "center" }}>
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
      {!passed &&(<div style={{display: "grid", placeItems: "center"}}>
        <VimEditor
      level={levelNum}
      value = {startValue}
      height = {"30vh"}
      commands = {[":q"]}
      onWin = {() => setPassed(true)}
      /></div>)}
      {passed && (
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
              <Link to="/levels/3" style={{ marginLeft: "8px", color: "#4caf50" }}> Level 3 </Link>
              </p>
              <p style = {{ color: "white" }}>
              Or go back home:
              <Link to="/" style= {{ marginLeft: "8px"}}> Home </Link>
            </p>
          </div>
        )
      }
    </>
  );
}