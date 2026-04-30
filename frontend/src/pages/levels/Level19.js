import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level19() {
    const levelNum = 19;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

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


    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-200">
            <aside className="w-[19vw] min-w-[320px] p-4">
                <Sidebar />
            </aside>

            <main className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                        <h1 className="text-6xl mb-2">Level 19</h1>
                        <h3 className="text-4xl mb-2">Replace a character</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            When you only need to fix a single character, entering and exiting Insert mode is overkill.<br /><br />
                            <kbd>r{"{char}"}</kbd> replaces the character under the cursor with <kbd>{"{char}"}</kbd> and immediately returns to Normal mode<br />
                            <kbd>R</kbd> enters Replace mode — every character you type overwrites the existing one. Press <kbd>Esc</kbd> to exit.<br /><br />
                            <span className="font-medium">
                                Objective: Fix the bug — change <code>return 9</code> to <code>return 0</code> using <kbd>r</kbd>.
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
                <DropDown title={"How do I use r?"} contents={"Navigate your cursor onto the '9', then press r followed by 0. No Enter or Esc needed — it replaces instantly."} moreClass="mb-2" />
                <DropDown title={"What's the difference between r and R?"} contents={"Lowercase r replaces exactly one character and snaps back to Normal mode. Uppercase R enters a continuous overwrite mode until you press Esc."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}