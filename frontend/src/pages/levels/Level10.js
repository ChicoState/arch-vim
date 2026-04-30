import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level10() {
    const levelNum = 10
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
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
                    <h1 className="text-6xl mb-2">Level 10</h1>
                    <h3 className="text-4xl mb-2">Challenge Level!</h3>
                    <hr className="mb-4 border-gray-600 w-96"/>
                    <p className="text-lg leading-8">
                        Combine all the skills you've learned to complete the objective!<br></br><br></br>
                        <span className="font-medium">
                            Objective: There is a type on line 4, and junk code on line 6. Fix the typo and delete the junk line, then save and quit.
                        </span>
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
                </>
            </div>
        </main>

        {/* Right side */}
        <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I delete a line?"} contents={"Remember: dd allows you to delete an entire line!"} moreClass="mb-2" />
                <DropDown title={"How do I save and quit?"} contents={":w allows you to save, while :q allows you to quit. You can also use them together with :wq."} />
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