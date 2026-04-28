import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level19() {
    const levelNum = 19;
    const [passed, setPassed] = useState(false);

    const startValue =
`#include <stdio.h>

int main() {
    int x = 5;
    int y = x * x;
    printf("Result: %d\n", y);
    return 9;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int x = 5;
    int y = x * x;
    printf("Result: %d\n", y);
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
                        <h1 className="text-7xl mb-2 pl-16">Level 19</h1>
                        <h3 className="pl-16 text-4xl mb-2">Replace a character</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            When you only need to fix a single character, entering and exiting Insert mode is overkill.<br /><br />
                            <kbd>r{"{char}"}</kbd> replaces the character under the cursor with <kbd>{"{char}"}</kbd> and immediately returns to Normal mode<br />
                            <kbd>R</kbd> enters Replace mode — every character you type overwrites the existing one. Press <kbd>Esc</kbd> to exit.<br /><br />
                            Objective: Fix the bug — change <code>return 9</code> to <code>return 0</code> using <kbd>r</kbd>.
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
                <DropDown title={"How do I use r?"} contents={"Navigate your cursor onto the '9', then press r followed by 0. No Enter or Esc needed — it replaces instantly."} moreClass="mb-2" />
                <DropDown title={"What's the difference between r and R?"} contents={"Lowercase r replaces exactly one character and snaps back to Normal mode. Uppercase R enters a continuous overwrite mode until you press Esc."} />
            </aside>
        </div>
    );
}