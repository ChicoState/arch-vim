import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level10() {
    const levelNum = 10
    const [passed, setPassed] = useState(false);
    const startValue =
`#include <stdio.h>

int main() {
    printf("Hello Word");
    return 0; 
    junk code
}
`
    const endValue = 
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
                <div className="ml-[15vw] mb-10">
                    <h1 className="text-7xl mb-2 pl-16">Level 10</h1>
                    <h3 className="pl-16 text-4xl mb-2">Challenge Level!</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">
                        Combine all the skills you've learned to complete the objective!<br></br><br></br>
                        Objective: There is a type on line 4, and junk code on line 6. Fix the typo and delete the junk line, then save and quit.
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                <VimEditor
                level={levelNum}
                value = {startValue}
                finalText = {endValue}
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
                <DropDown title={"How do I delete a line?"} contents={"Remember: dd allows you to delete an entire line!"} moreClass="mb-2" />
                <DropDown title={"How do I save and quit?"} contents={":w allows you to save, while :q allows you to quit. You can also use them together with :wq."} />
        </aside>
    </div>  
    );
}