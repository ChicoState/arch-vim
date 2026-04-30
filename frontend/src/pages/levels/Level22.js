import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level22() {
    const levelNum = 22;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));

    const startValue =
`#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}
`

    const finalValue =
`#include <stdio.h>

int main() {
    printf("Hello Vim");
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
                        <h1 className="text-6xl mb-2">Level 22</h1>
                        <h3 className="text-4xl mb-2">Text objects</h3>
                        <hr className="mb-4 border-gray-600 w-96" />
                        <p className="text-lg leading-8">
                            Text objects let you operate on logical chunks of text regardless of where your cursor is inside them.<br /><br />
                            <kbd>ciw</kbd> changes the entire word under the cursor<br />
                            <kbd>ci"</kbd> changes everything inside the nearest quotes<br />
                            <kbd>ci(</kbd> changes everything inside the nearest parentheses<br />
                            The <kbd>a</kbd> variants (e.g. <kbd>daw</kbd>) include the surrounding delimiter too<br /><br />
                            <span className="font-medium">
                                Objective: Change <code>"Hello World"</code> to <code>"Hello Vim"</code> using <kbd>ci"</kbd>.
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
                <DropDown title={"How do I use ci\"?"} contents={"Place your cursor anywhere inside or on the quotes on the printf line, then press ci\" — the contents will be deleted and you'll be in Insert mode. Type 'Hello Vim' and press Esc."} moreClass="mb-2" />
                <DropDown title={"What's the difference between i and a?"} contents={"'i' means inside (excludes the delimiters), 'a' means around (includes them). So ci\" changes the text inside the quotes, while ca\" would delete the quotes too."} />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>
        </div>
    );
}