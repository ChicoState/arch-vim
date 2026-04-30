import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level3() {
    const levelNum = 3
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const defaultValue =
`// Put VIM inside the brackets:
[   ]
`


    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[19vw] min-w-[320px] p-4">
            <Sidebar />
        </aside>

        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 3</h1>
                    <h3 className="text-4xl mb-2">Insert Mode</h3>
                    <hr className="mb-4 border-gray-600 w-96" />
                    <p className="text-lg leading-8">
                        Vim has multiple modes which allow for different actions to be taken. So far, you have been in what is called "Normal" mode, which is where most commands are used.<br></br>
                        Normal mode is the default mode of the Vim editor, but it can always be returned to from other modes by pressing your <kbd>Esc</kbd> key. Your current mode is listed on the bottom right of the editor.<br></br><br></br>
                        In this level, you will use what is called "Insert" mode.<br></br>
                        Insert mode is the mode that allows you to actually type!<br></br><br></br>
                        Press <kbd>i</kbd> to enter INSERT mode.<br></br>
                        Type <b>VIM</b> inside the brackets.<br></br>
                        Press <kbd>Esc</kbd> to return to NORMAL mode.<br></br><br></br>
                        <span className="font-medium">
                            Objective: Put VIM inside <b>[ ]</b>.
                        </span>
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                    <VimEditor
                        level={levelNum}
                        value={defaultValue}
                        finalTextRegex={/\[\s*VIM\s*\]/}
                        mode={"normal"}
                        onWin={() => setPassed(true)}
                    />
                </div>
                </>
            </div>
        </main>

        {/* Right side */}
        <aside className="w-[18vw] min-w-[280px] bg-gray-950 p-4">
            <p className="text-center text-2xl mb-4">Hints</p>
{/*                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />*/}
            {passed && (
                <div className="mt-6">
                    <PassedLevel levelNum={levelNum} />
                </div>
            )}
        </aside>
    </div>
    );
}