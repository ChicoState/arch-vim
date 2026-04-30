import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level24() {
    const levelNum = 24;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int main() {
    int foo = 0;
    foo = foo + 1;
    foo = foo * 2;
    printf("foo is: %d\\n", foo);
    printf("final foo: %d\\n", foo);
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    int bar = 0;
    bar = bar + 1;
    bar = bar * 2;
    printf("bar is: %d\\n", bar);
    printf("final bar: %d\\n", bar);
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
                        <h1 className="text-6xl mb-2">Level 24</h1>
                        <h3 className="text-4xl mb-2">Find and replace</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            When a name appears many times across a file, renaming it one occurrence at a time is painful. The substitute command handles all of them at once.<br /><br />
                            <kbd>:%s/old/new/g</kbd> replaces every occurrence of <code>old</code> with <code>new</code> in the entire file<br />
                            <kbd>:s/old/new/g</kbd> replaces on the current line only<br />
                            Adding <kbd>c</kbd> at the end (e.g. <kbd>:%s/old/new/gc</kbd>) asks for confirmation on each one<br /><br />
                            <span className="font-medium">
                                Objective: Rename every instance of <code>foo</code> to <code>bar</code> across the file.
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
                <DropDown title={"What do I type?"} contents={"Press : to open the command line, then type %s/foo/bar/g and press Enter."} moreClass="mb-2" />
                <DropDown title={"What does each part mean?"} contents={"% means the whole file, s means substitute, /foo/ is what to find, /bar/ is the replacement, and g means every occurrence on each line (not just the first)."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}