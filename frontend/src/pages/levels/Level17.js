import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level17() {
    const levelNum = 17;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int main() {
    int result = add(5, 3);
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
                        <h1 className="text-6xl mb-2">Level 17</h1>
                        <h3 className="text-4xl mb-2">Jump between paragraphs</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            When a file has multiple functions separated by blank lines, you can leap between them instantly.<br /><br />
                            <kbd>{"{"}</kbd> jumps to the start of the previous blank-line-separated block<br />
                            <kbd>{"}"}</kbd> jumps to the start of the next block<br /><br />
                            <span className="font-medium">
                                Objective: Starting at line 1, use <kbd>{"}"}</kbd> to jump until your cursor lands on line 10 (the blank line before <code>int main()</code>).
                            </span>
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                cursorLine={10}
                                onWin={() => setPassed(true)}
                            />
                        </div>
                    </>
                </div>
            </main>

            <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"Nothing is happening"} contents={"Make sure you're in Normal mode — press Esc first, then press }."} moreClass="mb-2" />
                <DropDown title={"How many times do I press }?"} contents={"Press } twice from line 1. First jump lands on the blank line after subtract, second lands on the blank line before main."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}