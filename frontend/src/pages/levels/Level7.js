import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
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
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <aside className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="ml-[15vw] mb-10">
                    <h1 className="text-7xl mb-2 pl-16">Level 7</h1>
                    <h3 className="pl-16 text-4xl mb-2">Even More Navigation!</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">Using <kbd>w</kbd>, <kbd>e</kbd>, and <kbd>b</kbd> allows you to jump to the end or beginning of words, <br></br>however there are also shortcuts to jump to the beginning and the end of lines.<br></br>
                    <div className="pl-4">
                        <kbd>0</kbd> jumps to the <span className="font-bold">start</span> of a line<br></br>
                        <kbd>$</kbd> jumps to the <span className="font-bold">end</span> of a line<br></br>
                    </div>
                    Alongside jumping to the beginning and end of lines, you an jump from one line to any other line you want.<br></br>
                    <div className="pl-4">
                        <kbd>:</kbd> followed by a line number jumps to that line<br></br>
                    </div>
                            <br></br>
                        Objective: Just using these new movement keys, jump to the end of line 15. {/* After 'Hello' */}
                    </p>
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