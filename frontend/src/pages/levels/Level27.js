import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level27() {
    const levelNum = 27;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const startValue =
`#include <stdio.h>

int main() {
    int baz = 0;
    baz = baz + 10
    baz = baz * 2
    printf("result: %d\\n", baz);
    printf("done with baz\\n");
    return 9;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int result = 0;
    result = result + 10;
    result = result * 2;
    printf("result: %d\\n", result);
    printf("done with result\\n");
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
                        <h1 className="text-6xl mb-2">Level 27</h1>
                        <h3 className="text-4xl mb-2">Challenge Level!</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Combine everything you've learned to fix this broken file.<br /><br />
                            The file has three classes of problems:<br />
                            — The variable <code>baz</code> should be named <code>result</code> everywhere<br />
                            — Two lines are missing their semicolons<br />
                            — The return value is wrong<br /><br />
                            <span className="font-medium">
                                There's no single right way to solve this — use whatever combination of commands feels most efficient to you.
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
                <DropDown title={"How should I tackle the rename?"} contents={"Use :%s/baz/result/g to rename all occurrences in one command."} moreClass="mb-2" />
                <DropDown title={"How should I tackle the semicolons?"} contents={"Fix the first missing semicolon with A; Esc, then use . to repeat the fix on the second line."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}