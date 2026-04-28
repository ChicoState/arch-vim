import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level6() {
    const levelNum = 6
    const [passed, setPassed] = useState(false);
    const startValue =
`#include <stdio.h>

int main() {
	printf("Hello World");
	return 0; 
}
`

    if (useCheckLevel(levelNum)) setPassed(true);

    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <aside className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 6</h1>
                    <h3 className="text-4xl mb-2">Advanced Navigation</h3>
                    <hr className="mb-4 border-gray-600 w-96" />
                    <p className="text-lg leading-8">
                        Beyond using <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd>, and <kbd>l</kbd> to navigate character by character, you can jump word to word.<br></br>
                        <kbd>w</kbd> jumps to the <span className="font-bold">start</span> of the next word<br></br>
                        <kbd>e</kbd> jumps to the <span className="font-bold">end</span> of the next word<br></br>
                        <kbd>b</kbd> jumps <span className="font-bold">back</span> to the <span className="font-bold">start</span> of the previous word<br></br><br></br>
                        <span className="font-medium">
                            Objective: Without using your arrow keys or h j k l, move the cursor to Line 4, Column 19.
                        </span>
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={19}
                cursorLine={4}
                onWin = {() => setPassed(true)}
                />
                </div>
                {passed && (
                    <div className="flex items-center justify-center">
                        <PassedLevel levelNum={levelNum}/>
                    </div>
                    )
                }   
                </>
            </div>
        </aside>

        {/* Right side */}
        <aside className="w-[16vw] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />
        </aside>
    </div>  
    );
}