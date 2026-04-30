import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level21() {
    const levelNum = 21;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int unused(int x) {
    return x * 2;
}

int main() {
    printf("%d\n", add(2, 3));
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    printf("%d\n", add(2, 3));
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
                        <h1 className="text-6xl mb-2">Level 21</h1>
                        <h3 className="text-4xl mb-2">Operators and motions</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Vim commands compose like a language: an <em>operator</em> (what to do) combined with a <em>motion</em> (how far).<br /><br />
                            <kbd>d3j</kbd> deletes the current line plus 3 lines down<br />
                            <kbd>d$</kbd> deletes from the cursor to the end of the line<br />
                            <kbd>dw</kbd> deletes from the cursor to the start of the next word<br /><br />
                            <span className="font-medium">
                                Objective: Delete the entire <code>unused</code> function and the blank line above it (4 lines total).
                            </span>
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
                    </>
                </div>
            </main>

            <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I delete multiple lines?"} contents={"Navigate to the blank line above 'int unused', then use d3j to delete that line plus the 3 lines below it."} moreClass="mb-2" />
                <DropDown title={"Can I use dd instead?"} contents={"You could press dd four times, but the point of this level is to combine an operator with a motion to do it in one command."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}