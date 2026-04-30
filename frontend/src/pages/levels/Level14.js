import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level14() {
    const levelNum = 14
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
                    <h1 className="text-6xl mb-2">Level 14</h1>
                    <h3 className="text-4xl mb-2">Jump up and down the file</h3>
                    <hr className="mb-4 border-gray-600 w-96"/>
                    <div className="text-lg leading-8">
                        <p>Using h, j, k, l can be quite slow in large files. One method of fixing this was the previously mentions <kbd>:</kbd> line jumping. <br></br>
                        Vim has another shortcut that allows for jumping to the beginning or end of a file.<br></br></p>
                        <div className="pl-4">
                            <kbd>gg</kbd> Jumps to the first line of the file<br></br>
                            <kbd>G</kbd> Jumps to the last line of the file
                        </div><br></br>
                        <p>You can also prefix <kbd>G</kbd> with a number to jump to a specific line. Ex:<br></br></p>
                        <div className="pl-4">
                            <kbd>G7</kbd> Jumps to line 7, the same as <kbd>:7</kbd>
                        </div><br></br>
                        <p>This can also act as a 'noun' in the previously mentioned 'verb + noun' comprehensive commands. Ex:</p>
                        <div className="pl-4">
                            <kbd>dG7</kbd> Deletes from current line to Line 7
                        </div><br></br>
                        <p>
                            <span className="font-medium">
                                Objective: Using this new notation, jump to line 5.
                            </span> {/* After 'Hello' */}
                        </p>
                    </div>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
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
                    )
                }
        </aside>
    </div>  
    );
}