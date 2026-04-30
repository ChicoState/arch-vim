import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level25() {
    const levelNum = 25;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

void printAll() {
    printf("alpha\\n");
    printf("beta\\n");
    printf("gamma\\n");
    printf("delta\\n");
    printf("epsilon\\n");
    printf("zeta\\n");
    printf("eta\\n");
    printf("theta\\n");
}

int main() {
    printAll();
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
                        <h1 className="text-6xl mb-2">Level 25</h1>
                        <h3 className="text-4xl mb-2">Marks</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Marks let you bookmark a position in a file and jump back to it instantly — great for navigating large files.<br /><br />
                            <kbd>m{"{letter}"}</kbd> sets a mark at the current cursor position<br />
                            <kbd>'{"{letter}"}</kbd> jumps back to the line of that mark<br />
                            <kbd>`{"{letter}"}</kbd> jumps back to the exact cursor position of the mark<br /><br />
                            <span className="font-medium">
                                Objective: Set a mark on line 3 (<code>void printAll()</code>), jump to the bottom of the file with <kbd>G</kbd>, then jump back to line 3 using your mark.
                            </span>
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                cursorLine={3}
                                keystrokes={["m", "G"]}
                                onWin={() => setPassed(true)}
                            />
                        </div>
                    </>
                </div>
            </main>

            <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I set a mark?"} contents={"Navigate to line 3, then press ma to set mark 'a' at that position."} moreClass="mb-2" />
                <DropDown title={"How do I jump back?"} contents={"After pressing G to go to the bottom, press 'a (apostrophe then a) to jump back to the line where you set the mark."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}