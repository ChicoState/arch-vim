import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level16() {
    const levelNum = 16;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int main() {
    int score = 0;
    int bonus = 100;
    int total = score + bonus;
    return 0;
}
`


    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-200">
            <aside className="w-[19vw] min-w-[320px] p-4">
                <Sidebar />
            </aside>

            <main className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                        <h1 className="text-6xl mb-2">Level 16</h1>
                        <h3 className="text-4xl mb-2">Jump to a character</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Instead of pressing <kbd>l</kbd> repeatedly, you can jump directly to any character on the current line.<br /><br />
                            <kbd>f{"{char}"}</kbd> moves the cursor forward to the next occurrence of <kbd>{"{char}"}</kbd> on the line<br />
                            <kbd>t{"{char}"}</kbd> moves the cursor to just before <kbd>{"{char}"}</kbd><br />
                            <kbd>;</kbd> repeats the last f/t jump<br /><br />
                            <span className="font-medium">
                                Objective: Navigate to line 6 and use <kbd>f</kbd> to jump your cursor onto the <kbd>+</kbd> sign.
                            </span>
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                cursorLine={6}
                                cursorCol={23}
                                onWin={() => setPassed(true)}
                            />
                        </div>
                    </>
                </div>
            </main>

            <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I get to line 6?"} contents={"Use j to move down to line 6, then 0 to jump to the start of the line."} moreClass="mb-2" />
                <DropDown title={"How do I jump to the + ?"} contents={"Type f+ to jump directly to the + character on that line."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}