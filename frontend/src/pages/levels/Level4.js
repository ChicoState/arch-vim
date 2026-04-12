import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";

export default function Level4() {
    const levelNum = 4
    const [passed, setPassed] = useState(false);
    const defaultValue=`#include <stdio.h>

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
        <div style={{ padding: "10px" }}>
            <h1>Level 4</h1>
            <h3>How to save a file</h3>
            <p>After escaping, type <kbd>:w</kbd> and press Enter to save the file.<br />
                Objective: run the save command to pass.
            </p>

            <>
                <VimEditor
                level={levelNum}
                value = {defaultValue}
                possibleCommands = {[":w", ":wq"]}
                onWin = {() => setPassed(true)}
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