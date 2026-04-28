import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level22() {
    const levelNum = 22;
    const [passed, setPassed] = useState(false);

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
                        <h1 className="text-7xl mb-2 pl-16">Level 22</h1>
                        <h3 className="pl-16 text-4xl mb-2">Text objects</h3>
                        <hr className="mb-4 border-gray-600 w-96 ml-16" />
                        <p className="pl-28">
                            Text objects let you operate on logical chunks of text regardless of where your cursor is inside them.<br /><br />
                            <kbd>ciw</kbd> changes the entire word under the cursor<br />
                            <kbd>ci"</kbd> changes everything inside the nearest quotes<br />
                            <kbd>ci(</kbd> changes everything inside the nearest parentheses<br />
                            The <kbd>a</kbd> variants (e.g. <kbd>daw</kbd>) include the surrounding delimiter too<br /><br />
                            Objective: Change <code>"Hello World"</code> to <code>"Hello Vim"</code> using <kbd>ci"</kbd>.
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
                <DropDown title={"How do I use ci\"?"} contents={"Place your cursor anywhere inside or on the quotes on the printf line, then press ci\" — the contents will be deleted and you'll be in Insert mode. Type 'Hello Vim' and press Esc."} moreClass="mb-2" />
                <DropDown title={"What's the difference between i and a?"} contents={"'i' means inside (excludes the delimiters), 'a' means around (includes them). So ci\" changes the text inside the quotes, while ca\" would delete the quotes too."} />
            </aside>
        </div>
    );
}