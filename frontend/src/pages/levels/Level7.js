import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level7() {
    const levelNum = 7
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
        <aside className="w-[19vw] min-w-[320px] p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 7</h1>
                    <h3 className="text-4xl mb-2">Even More Navigation!</h3>
                    <hr className="mb-4 border-gray-600 w-96" />
                    <div className="text-lg leading-8">
                        <p>
                            Using <kbd>w</kbd>, <kbd>e</kbd>, and <kbd>b</kbd> allows you to jump to the end or beginning of words, <br></br>however there are also shortcuts to jump to the beginning and the end of lines.<br></br>
                        </p>
                        <div className="pl-4">
                            <kbd>0</kbd> jumps to the <span className="font-bold">start</span> of a line<br></br>
                            <kbd>$</kbd> jumps to the <span className="font-bold">end</span> of a line<br></br>
                        </div>
                        <p>
                            Alongside jumping to the beginning and end of lines, you an jump from one line to any other line you want.<br></br>
                        </p>
                        <div className="pl-4">
                            <kbd>:</kbd> followed by a line number jumps to that line<br></br>
                        </div>
                        <br></br>
                        <p>
                            <span className="font-medium">
                                Objective: Just using these new movement keys, jump to the end of line 15.
                            </span> {/* After 'Hello' */}
                        </p>
                    </div>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={14}
                cursorLine={5}
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
                )}
        </aside>
    </div>  
    );
}