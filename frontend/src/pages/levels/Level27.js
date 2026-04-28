import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level27() {
    const levelNum = 27;
    const [passed, setPassed] = useState(false);

    const startValue =
`#include <stdio.h>

int main() {
    int baz = 0;
    baz = baz + 10
    baz = baz * 2
    printf("result: %d\n", baz);
    printf("done with baz\n");
    return 9;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int result = 0;
    result = result + 10;
    result = result * 2;
    printf("result: %d\n", result);
    printf("done with result\n");
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
                        <h1 className="text-7xl mb-2 pl-16">Level 27</h1>
                        <h3 className="pl-16 text-4xl mb-2">Challenge Level!</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            Combine everything you've learned to fix this broken file.<br /><br />
                            The file has three classes of problems:<br />
                            — The variable <code>baz</code> should be named <code>result</code> everywhere<br />
                            — Two lines are missing their semicolons<br />
                            — The return value is wrong<br /><br />
                            There's no single right way to solve this — use whatever combination of commands feels most efficient to you.
                        </p>
                    </div>
                    <>
                        <div className="flex items-center justify-center">
                            <VimEditor
                                level={levelNum}
                                value={startValue}
                                finalText={finalValue}
                                commands={[":s"]}
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
                <DropDown title={"How should I tackle the rename?"} contents={"Use :%s/baz/result/g to rename all occurrences in one command."} moreClass="mb-2" />
                <DropDown title={"How should I tackle the semicolons?"} contents={"Fix the first missing semicolon with A; Esc, then use . to repeat the fix on the second line."} />
            </aside>
        </div>
    );
}