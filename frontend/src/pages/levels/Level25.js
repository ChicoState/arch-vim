import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level25() {
    const levelNum = 25;
    const [passed, setPassed] = useState(false);

    const startValue =
`#include <stdio.h>

void printAll() {
    printf("alpha\n");
    printf("beta\n");
    printf("gamma\n");
    printf("delta\n");
    printf("epsilon\n");
    printf("zeta\n");
    printf("eta\n");
    printf("theta\n");
}

int main() {
    printAll();
    return 0;
}
`

    useEffect(() => {
        loadProgress().then(data => {
            if (data[`level_${levelNum}`]?.passed) setPassed(true);
        });
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-200">
            <aside className="w-[16vw] bg-gray-950 p-4">
                <Sidebar />
            </aside>

            <aside className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="ml-[15vw] mb-10">
                        <h1 className="text-7xl mb-2 pl-16">Level 25</h1>
                        <h3 className="pl-16 text-4xl mb-2">Marks</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            Marks let you bookmark a position in a file and jump back to it instantly — great for navigating large files.<br /><br />
                            <kbd>m{"{letter}"}</kbd> sets a mark at the current cursor position<br />
                            <kbd>'{"{letter}"}</kbd> jumps back to the line of that mark<br />
                            <kbd>`{"{letter}"}</kbd> jumps back to the exact cursor position of the mark<br /><br />
                            Objective: Set a mark on line 3 (<code>void printAll()</code>), jump to the bottom of the file with <kbd>G</kbd>, then jump back to line 3 using your mark.
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                cursorLine={3}
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
                <DropDown title={"How do I set a mark?"} contents={"Navigate to line 3, then press ma to set mark 'a' at that position."} moreClass="mb-2" />
                <DropDown title={"How do I jump back?"} contents={"After pressing G to go to the bottom, press 'a (apostrophe then a) to jump back to the line where you set the mark."} />
            </aside>
        </div>
    );
}