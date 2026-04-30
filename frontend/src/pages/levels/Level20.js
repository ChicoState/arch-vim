import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level20() {
    const levelNum = 20;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int main() {
    printf("line one\\n")
    printf("line two\\n")
    printf("line three\\n")
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    printf("line one\\n");
    printf("line two\\n");
    printf("line three\\n");
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
                        <h1 className="text-6xl mb-2">Level 20</h1>
                        <h3 className="text-4xl mb-2">Repeat your last action</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            The dot command is one of vim's most powerful habits. It repeats your entire last edit — however complex.<br /><br />
                            <kbd>.</kbd> repeats the last change you made<br /><br />
                            For example: fix one missing semicolon with <kbd>A</kbd><kbd>;</kbd><kbd>Esc</kbd>, then just press <kbd>.</kbd> on each remaining line.<br /><br />
                            <span className="font-medium">
                                Objective: All three <code>printf</code> lines are missing semicolons. Fix the first one, then use <kbd>.</kbd> to fix the other two.
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
                <DropDown title={"How do I add the first semicolon?"} contents={"Go to the first printf line and press A to enter Insert mode at the end of the line, type ; then press Esc."} moreClass="mb-2" />
                <DropDown title={"How do I use the dot command?"} contents={"Move down to the next printf line with j, then press . to repeat the exact same edit."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}