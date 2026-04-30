import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level11() {
    const levelNum = 11
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

int main() {
    int result = add(10, 5);
    printf("Result: %d\\n", result);
    return 0;
}
`


    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[19vw] min-w-[320px] p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 11</h1>
                    <h3 className="text-4xl mb-2">Basic Search</h3>
                    <hr className="mb-4 border-gray-600 w-96"/>
                    <div className="text-lg leading-8">
                        <p>Beyond using <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd>, and <kbd>l</kbd> to navigate character by character, you can jump word to word.<br></br><br></br></p>
                        <div className="pl-4">
                            <kbd>/</kbd> is the search key. Following it with a phrase and pressing <kbd>Enter</kbd> will jump to the first instance of that word.<br></br>
                            <kbd>n</kbd> jumps to the next match<br></br>
                            <kbd>N</kbd> jumps to the previous match<br></br>
                        </div><br></br>
                        <p>
                            <span className="font-medium">
                                Objective: Use search to jump to the second instance of 'result'.
                            </span> {/* After 'Hello' */}
                        </p>
                    </div>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={13}
                cursorLine={17}
                onWin = {() => setPassed(true)}
                />
                </div>
                </>
            </div>
        </main>

        {/* Right side */}
        <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum}/>
                    </div>
                    )
                }
        </aside>
    </div>  
    );
}