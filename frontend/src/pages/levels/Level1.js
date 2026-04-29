import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level1() {
    const levelNum = 1
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

int main() {
	printf("Hello World");
	return 0; 
}
`

    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div className="w-full max-w-[1100px] mx-auto">
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 1</h1>
                    <h3 className="text-4xl mb-2">Learn how to navigate a file</h3>
                    <hr className="mb-4 border-gray-600 w-96" />
                    <p className="text-lg leading-8">By default, Vim uses the keys h, j, k, l for navigation in the editor.<br></br>
                            <kbd>h</kbd> move left<br></br>
                            <kbd>j</kbd> move down<br></br>
                            <kbd>k</kbd> move up<br></br>
                            <kbd>l</kbd> move right<br></br><br></br>
                        <span className="font-medium">
                            Objective: Without using your arrow keys, move the cursor to Line 4, Column 15.
                        </span> {/* After 'Hello' */}
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={15}
                cursorLine={4}
                onWin = {() => setPassed(true)}
                />
                </div>
		        </>
            </div>
        </main>

        {/* Right side */}
        <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
{/*                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />*/}
            {passed && (
                <div className="mt-6">
                    <PassedLevel levelNum={levelNum} />
                </div>
            )}
        </aside>
    </div>  
    );
}