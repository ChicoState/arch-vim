import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";

export default function Level1() {
    const levelNum = 1
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
    <div className="flex h-screen bg-gray-950 text-gray-200">

        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        <aside className="flex-1 p-4">
            <div style={{ padding: "10px" }}>
                <h1>Level 1</h1>
                <h3>Learn how to navigate a file</h3>
                <p>By default, Vim uses the keys h, j, k, l for navigation in the editor.<br></br>
                    <kbd>h</kbd> move left<br></br>
                    <kbd>j</kbd> move down<br></br>
                    <kbd>k</kbd> move up<br></br>
                    <kbd>l</kbd> move right<br></br><br></br>
                Objective: Without using your arrow keys, move the cursor to Line 4, Column 15. {/* After 'Hello' */}
                </p>
                <>
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={15}
                cursorLine={4}
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
                            <p style = {{ color: "white" }}>
                            Move on to the next level:
                            <Link to="/levels/2" style={{ marginLeft: "8px", color: "#4caf50" }}> Level 2 </Link>
                        </p>
                        <p style = {{ color: "white" }}>
                            Or go back home:
                            <Link to="/" style= {{ marginLeft: "8px"}}> Home </Link>
                        </p>
                    </div>
                    )
                }   
		        </>
            </div>
        </aside>

        <aside className="w-[16vw] bg-gray-950 p-4 shadow-[0_0_20px_rgba(99,102,241,0.7)]">
            <p className="text-center text-2xl">Hints</p>
                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />
        </aside>
    </div>  
    );
}