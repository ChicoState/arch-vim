import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level3() {
    const levelNum = 3
    const [passed, setPassed] = useState(false);
    const defaultValue =
`// Put VIM inside the brackets:
[   ]
`

    useEffect(() => {
        loadProgress().then(
            data=>{
                if (data[`level_${levelNum}`]?.passed) 
                    setPassed(true);
                });
            }, []);

    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        {/* Middle section */}
        <aside className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="ml-[15vw] mb-10">
                    <h1 className="text-7xl mb-2 pl-16">Level 3</h1>
                    <h3 className="pl-16 text-4xl mb-2">Insert Mode</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">
                        Vim has multiple modes which allow for different actions to be taken. So far, you have been in what is called "Normal" mode, which is where most commands are used.<br></br>
                        Normal mode is the default mode of the Vim editor, but it can always be returned to from other modes by pressing your <kbd>Esc</kbd> key. Your current mode is listed on the bottom right of the editor.<br></br><br></br>
                        In this level, you will use what is called "Insert" mode.<br></br>
                        Insert mode is the mode that allows you to actually type!<br></br><br></br>
                        Press <kbd>i</kbd> to enter INSERT mode.<br></br>
                        Type <b>VIM</b> inside the brackets.<br></br>
                        Press <kbd>Esc</kbd> to return to NORMAL mode.<br></br><br></br>
                        Objective: Put VIM inside <b>[ ]</b>.
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
                {passed && (
                    <div className="flex items-center justify-center">
                        <PassedLevel levelNum={levelNum}/>
                    </div>
                    )
                }
                </>
            </div>
        </aside>

        {/* Right side */}
        <aside className="w-[16vw] bg-gray-950 p-4">
            <p className="text-center text-2xl mb-4">Hints</p>
{/*                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />*/}

        </aside>
    </div>
    );
}