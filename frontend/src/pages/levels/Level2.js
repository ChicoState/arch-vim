import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";

export default function Level2() {
    const levelNum = 2
    const [passed, setPassed] = useState(false);
    const startValue =
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
                    <h1 className="text-7xl mb-2 pl-16">Level 2</h1>
                    <h3 className="pl-16 text-4xl mb-2">How to exit a file</h3>
                    <hr className="mb-4 border-gray-600 w-96 ml-16"/>
                    <p className="pl-28">
                            When starting with vim it's not always clear how to exit.<br></br>
                            To open the console, press <kbd>:</kbd><br></br>
                            Typing <kbd>:q</kbd> will exit the vim editor.<br></br>
                            If you make an accidental change and want to quit without saving, type <kbd>:q!</kbd><br></br><br></br>
                            Objective: Simply close the editor.
                    </p>  
                </div>
                <>
                <div className="flex items-center justify-center">
                {!passed && (
                    <VimEditor
                        level={levelNum}
                        value={startValue}
                        height={"30vh"}
                        commands={[":q"]}
                        onWin={() => setPassed(true)}
                    />
                )}
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
        <aside className="w-[16vw] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown title={"How do I open the console?"} contents={"Press the : key while in normal mode to open the Vim command line."} moreClass="mb-2" />
                <DropDown title={"The editor won't close!"} contents={"Make sure you're in normal mode first (press Esc), then type :q and hit Enter."} />
        </aside>
    </div>  
    );
}