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
            <aside className="w-[16vw] bg-gray-950 p-4">
                <Sidebar />
            </aside>

            <aside className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="ml-[15vw] mb-10">
                        <h1 className="text-7xl mb-2 pl-16">Level 17</h1>
                        <h3 className="pl-16 text-4xl mb-2">Jump between paragraphs</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            When a file has multiple functions separated by blank lines, you can leap between them instantly.<br /><br />
                            <kbd>{"{"}</kbd> jumps to the start of the previous blank-line-separated block<br />
                            <kbd>{"}"}</kbd> jumps to the start of the next block<br /><br />
                            Objective: Starting at line 1, use <kbd>{"}"}</kbd> to jump until your cursor lands on line 10 (the blank line before <code>int main()</code>).
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
                <DropDown title={"Nothing is happening"} contents={"Make sure you're in Normal mode — press Esc first, then press }."} moreClass="mb-2" />
                <DropDown title={"How many times do I press }?"} contents={"Press } twice from line 1. First jump lands on the blank line after subtract, second lands on the blank line before main."} />
            </aside>
        </div>
    );
}