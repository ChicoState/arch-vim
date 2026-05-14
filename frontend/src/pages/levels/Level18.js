import { useEffect, useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel, { useProgress } from "../../components/checkLevelPassed";

export default function Level18() {
    const levelNum = 18;
    const passedFromProgress = useCheckLevel(levelNum);
    const [passed, setPassed] = useState(passedFromProgress);
    const [result, setResult] = useState(null);
    const { progress } = useProgress();

    const savedResult = progress[`level_${levelNum}`];
    const displayResult = result ?? savedResult;

    useEffect(() => {
        if (passedFromProgress) {
            setPassed(true);
        }
    }, [passedFromProgress]);

    const startValue =
`#include <stdio.h>

int main() {
    int foo = 42;
    printf("Value: %d\n", foo);
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int count = 42;
    printf("Value: %d\n", count);
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
                        <h1 className="text-6xl mb-2">Level 18</h1>
                        <h3 className="text-4xl mb-2">Change a word</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Deleting a word and re-entering Insert mode separately is tedious. The <kbd>c</kbd> operator does both at once.<br /><br />
                            <kbd>cw</kbd> deletes from the cursor to the end of the word and enters Insert mode<br />
                            <kbd>cc</kbd> deletes the entire line and enters Insert mode<br />
                            <kbd>C</kbd> deletes from the cursor to the end of the line and enters Insert mode<br /><br />
                            <span className="font-medium">
                                Objective: Rename the variable <code>foo</code> to <code>count</code> in both places it appears.
                            </span>
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                finalText={finalValue}
                                onWin={(data) => {
                                    setPassed(true);
                                    setResult(data);
                                }}
                            />
                        </div>
                    </>
                </div>
            </main>

            <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I use cw?"} contents={"Navigate to the f in 'foo', press cw, then type 'count' and press Esc."} moreClass="mb-2" />
                <DropDown title={"Do I have to do it twice?"} contents={"Yes — navigate to each 'foo' and use cw each time. You'll learn a faster way to rename things later!"} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} result={displayResult} />
                    </div>
                )}
            </aside>
        </div>
    );
}
