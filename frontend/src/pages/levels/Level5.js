import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level5() {
    const levelNum = 5
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const defaultValue =
`#include <stdio.h>

int main() {
  printf("Hello World");
  return 0; 
}
`
    const finalValue =
`#include <stdio.h>

int main() {
  printf("Hello Vim");
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
                    <h1 className="text-7xl mb-2 pl-16">Level 5</h1>
                    <h3 className="pl-16 text-4xl mb-2">Challenge Level!</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">
                        Combine all the skills you've learned to complete the objective!<br></br><br></br>
                        Objective: Change <kbd>Hello World</kbd> to <kbd>Hello Vim</kbd>, then save and quit.
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                    <VimEditor
                        level={levelNum}
                        value={defaultValue}
                        finalText={finalValue}
                        possibleCommands={[":q", ":wq"]}
                        onWin={() => setPassed(true)}
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
        <aside className="w-[16vw] bg-gray-950 p-4">
            <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I edit the text?"} contents={"Navigate to the word 'World' using h/j/k/l, then press i to enter Insert mode and make your change."} moreClass="mb-2" />
                <DropDown title={"How do I save and quit?"} contents={"Press Esc to return to Normal mode, then type :wq and press Enter to save and quit in one step."} />
        </aside>
    </div>
    );
}