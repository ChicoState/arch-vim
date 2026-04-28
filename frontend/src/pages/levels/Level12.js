import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level12() {
    const levelNum = 12
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

int main() {
    printf("Hello World");
    return 0; 
}
`
    const endValue =
`#include <stdio.h>

int main() {
    printf(" World");
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
                    <h1 className="text-7xl mb-2 pl-16">Level 12</h1>
                    <h3 className="pl-16 text-4xl mb-2">Comprehensive Commands</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">Some Vim commands are comprehensive, as in, they are comprised of a verb and a 'noun'.<br></br>You've already been introduced to one of these verbs, <kbd>d</kbd>.<br></br><br></br> For this level, you will need to combine some of the following<br></br>
                    <div className="pl-4">
                            <kbd>c</kbd> change - verb<br></br>
                            <kbd>d</kbd> delete - verb<br></br>
                            <kbd>w</kbd> word - noun<br></br>
                            <kbd>iw</kbd> inner word - noun<br></br><br></br>
                    </div>
                    These can be combined into:
                    <div className="pl-4">
                        <kbd>cw</kbd> - ends in insert mode<br></br>
                        <kbd>ciw</kbd> - ends in insert mode<br></br>
                        <kbd>dw</kbd> - ends in normal mode<br></br>
                        <kbd>diw</kbd> - ends in normal mode<br></br>
                    </div><br></br>
                        Objective: Use any of these commands to remove the word "Hello", then save and quit. {/* After 'Hello' */}
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                finalText={endValue}
                possibleCommands={[":q", ":wq"]}
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