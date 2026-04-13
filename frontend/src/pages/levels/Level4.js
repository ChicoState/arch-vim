import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level4() {
    const levelNum = 4
    const [passed, setPassed] = useState(false);
    const defaultValue =
`#include <stdio.h>

int main() {
  printf("Hello World");
return 0;
}
`

    useEffect(() => {
        loadProgress().then(
            data=>{
                if (data[`level_${levelNum}`]?.passed) 
                    setPassed(true);
                });
            }, []);

    return (
    <div className="flex h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[16vw] bg-gray-950 p-4">
            <Sidebar />
        </aside>

        {/* Middle section */}
        <aside className="flex-1 pt-10 p-4">
            <div style={{ padding: "10px" }}>
                <div className="ml-[15vw] mb-10">
                    <h1 className="text-7xl mb-2 pl-16">Level 4</h1>
                    <h3 className="pl-16 text-4xl mb-2">How to save a file</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">
                        After escaping to Normal mode, type <kbd>:w</kbd> and press Enter to save the file.<br></br><br></br>
                        Objective: Run the save command to pass.
                    </p>
                </div>
                <>
                <div className="flex items-center justify-center">
                    <VimEditor
                        level={levelNum}
                        value={defaultValue}
                        possibleCommands={[":w", ":wq"]}
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
                <DropDown title={"How do I open the command line?"} contents={"Make sure you're in Normal mode (press Esc first), then press : to open the Vim command line."} moreClass="mb-2" />
                <DropDown title={"Can I save and quit at once?"} contents={"Yes! You can use :wq to write (save) and quit in a single command."} />
        </aside>
    </div>
    );
}