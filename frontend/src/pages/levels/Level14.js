import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
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
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <aside className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="ml-[15vw] mb-10">
                    <h1 className="text-7xl mb-2 pl-16">Level 14</h1>
                    <h3 className="pl-16 text-4xl mb-2">Jump up and down the file</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">Using h, j, k, l can be quite slow in large files. One method of fixing this was the previously mentions <kbd>:</kbd> line jumping. <br></br>
                    Vim has another shortcut that allows for jumping to the beginning or end of a file.<br></br>
                    <div className="pl-4">
                        <kbd>gg</kbd> Jumps to the first line of the file
                        <kbd>G</kbd> Jumps to the last line of the file
                    </div><br></br>
                    You can also prefix <kbd>G</kbd> with a number to jump to a specific line. Ex:<br></br>
                    <div className="pl-4">
                        <kbd>G7</kbd> Jumps to line 7, the same as <kbd>:7</kbd>
                    </div><br></br>
                    This can also act as a 'noun' in the previously mentioned 'verb + noun' comprehensive commands. Ex:
                    <div className="pl-4">
                        <kbd>dG7</kbd> Deletes from current line to Line 7
                    </div><br></br>
                        Objective: Using this new notation, jump to line 5. {/* After 'Hello' */}
                    </p>
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