import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
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
        <aside className="w-[19vw] min-w-[320px] p-4">
            <Sidebar />
        </aside>

        
        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 12</h1>
                    <h3 className="text-4xl mb-2">Comprehensive Commands</h3>
                    <hr className="mb-4 border-gray-600 w-96"/>
                    <div className="text-lg leading-8">
                        <p>Some Vim commands are comprehensive, as in, they are comprised of a verb and a 'noun'.<br></br>You've already been introduced to one of these verbs, <kbd>d</kbd>.<br></br><br></br> For this level, you will need to combine some of the following<br></br></p>
                        <div className="pl-4">
                                <kbd>c</kbd> change - verb<br></br>
                                <kbd>d</kbd> delete - verb<br></br>
                                <kbd>w</kbd> word - noun<br></br>
                                <kbd>iw</kbd> inner word - noun<br></br><br></br>
                        </div>
                        <p>These can be combined into:</p>
                        <div className="pl-4">
                            <kbd>cw</kbd> - ends in insert mode<br></br>
                            <kbd>ciw</kbd> - ends in insert mode<br></br>
                            <kbd>dw</kbd> - ends in normal mode<br></br>
                            <kbd>diw</kbd> - ends in normal mode<br></br>
                        </div><br></br>
                        <p>
                            <span className="font-medium">
                                Objective: Use any of these commands to remove the word "Hello", then save and quit.
                            </span> {/* After 'Hello' */}
                        </p>
                    </div>
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