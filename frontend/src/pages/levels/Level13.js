import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level13() {
    const levelNum = 13
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
                    <h1 className="text-6xl mb-2">Level 13</h1>
                    <h3 className="text-4xl mb-2">Jump between brackets</h3>
                    <hr className="mb-4 border-gray-600 w-96"/>
                    <div className="text-lg leading-8">
                        <p>A nice to have feature in a number of programming languages that Vim provides, is a shortcut to jump between opening and closing brackets.<br></br><br></br></p>
                        <div className="pl-4">
                            <kbd>%</kbd> jumps the cursor to the matching bracket, brace, or parenthesis of the one your cursor is on <br></br>
                            This works on &#123;, &#125;, &#40;, &#41;, &#91;, and &#93;.
                        </div><br></br>
                        <p>
                            <span className="font-medium">
                                Objective: From the opening &#123; , jump to it's corresponding &#125; .
                            </span>
                        </p>
                    </div>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                cursorCol={1}
                cursorLine={6}
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