import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level23() {
    const levelNum = 23;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

int main() {
    int x = 10;
    // debug: checking x
    // debug: this is temporary
    // debug: remove before release
    printf("%d\n", x);
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int x = 10;
    printf("%d\n", x);
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
                        <h1 className="text-7xl mb-2 pl-16">Level 23</h1>
                        <h3 className="pl-16 text-4xl mb-2">Visual mode</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            Visual mode lets you select text before applying an operator — helpful when you want to see exactly what you're about to change.<br /><br />
                            <kbd>v</kbd> starts character-wise visual selection<br />
                            <kbd>V</kbd> starts line-wise visual selection<br />
                            Move to extend the selection, then press an operator like <kbd>d</kbd>, <kbd>c</kbd>, or <kbd>y</kbd><br /><br />
                            Objective: Use <kbd>V</kbd> to select the 3 debug comment lines and delete them.
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
                <DropDown title={"How do I select multiple lines?"} contents={"Navigate to the first // debug line, press V to start line selection, then press j twice to extend the selection down two more lines."} moreClass="mb-2" />
                <DropDown title={"How do I delete the selection?"} contents={"Once you have the 3 lines highlighted, press d to delete them all."} />
            </aside>
        </div>
    );
}