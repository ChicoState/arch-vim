import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level26() {
    const levelNum = 26;
    const [passed, setPassed] = useState(false);

    const startValue =
`#include <stdio.h>

int main() {
    int a = 1
    int b = 2
    int c = 3
    int d = 4
    int e = 5
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int a = 1;
    int b = 2;
    int c = 3;
    int d = 4;
    int e = 5;
    return 0;
}
`

    if (useCheckLevel(levelNum)) setPassed(true);

    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-200">
            <aside className="w-[16vw] bg-gray-950 p-4">
                <Sidebar />
            </aside>

            <aside className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="ml-[15vw] mb-10">
                        <h1 className="text-7xl mb-2 pl-16">Level 26</h1>
                        <h3 className="pl-16 text-4xl mb-2">Macros</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            Macros record a sequence of commands so you can replay them with a single keystroke.<br /><br />
                            <kbd>q{"{letter}"}</kbd> starts recording into a register<br />
                            <kbd>q</kbd> stops recording<br />
                            <kbd>@{"{letter}"}</kbd> plays the macro back<br />
                            <kbd>5@{"{letter}"}</kbd> plays it back 5 times<br /><br />
                            Objective: Record a macro that appends a semicolon to the end of a line and moves down. Play it back to fix all 5 lines.
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                finalText={finalValue}
                                onWin={() => setPassed(true)}
                            />
                        </div>
                        {passed && (
                            <div className="flex items-center justify-center">
                                <PassedLevel levelNum={levelNum} />
                            </div>
                        )}
                    </>
                </div>
            </aside>

            <aside className="w-[16vw] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I record the macro?"} contents={"On the first 'int a' line, press qa to start recording, then A; Esc j to append the semicolon and move down. Press q to stop."} moreClass="mb-2" />
                <DropDown title={"How do I replay it?"} contents={"Press 4@a to replay the macro 4 more times, or @a repeatedly. The macro moves down a line each time so it fixes each line in sequence."} />
            </aside>
        </div>
    );
}