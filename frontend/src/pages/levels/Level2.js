import { useEffect, useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar"
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import useCheckLevel, { useProgress } from "../../components/checkLevelPassed";

export default function Level2() {
    const levelNum = 2
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
	printf("Hello World");
	return 0; 
}
`


    return (
    <div className="flex min-h-screen bg-gray-950 text-gray-200">
        {/* Sidebar (the left side) */}
        <aside className="w-[19vw] min-w-[320px] p-4">
            <Sidebar />
        </aside>

        {/* Middle section */}
        <main className="flex-1 pt-10 p-4">
            <div className="w-full max-w-[1100px] mx-auto">
                <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                    <h1 className="text-6xl mb-2">Level 2</h1>
                    <h3 className="text-4xl mb-2">How to exit a file</h3>
                    <hr className="mb-4 border-gray-600 w-96" />
                    <p className="text-lg leading-8">
                            When starting with vim it's not always clear how to exit.<br></br>
                            To open the console, press <kbd>:</kbd><br></br>
                            Typing <kbd>:q</kbd> will exit the vim editor.<br></br>
                            If you make an accidental change and want to quit without saving, type <kbd>:q!</kbd><br></br><br></br>
                            <span className="font-medium">
                                Objective: Simply close the editor.
                            </span>
                    </p>  
                </div>
                <>
                <div className="flex items-center justify-center">
                    <VimEditor
                        level={levelNum}
                        value={startValue}
                        height={"30vh"}
                        commands={[":q"]}
                        onWin={(data) => {
                            setPassed(true);
                            setResult(data);
                        }}
                    />
                </div>
                {passed && (
                    <div className="flex items-center justify-center mt-4">
                        <PassedLevel levelNum={levelNum} result={displayResult}/>
                    </div>
                    )
                }
                </>
            </div>
        </main>

        {/* Right side */}
        <aside className="w-[16vw] bg-gray-950 p-4 ">
            <p className="text-center text-2xl mb-4">Hints</p>
{/*                <DropDown title={"Testing"} contents={"More testing"} moreClass="mb-2" />
                <DropDown title={"Testing 2"} contents={"Testtestest"} />*/}

        </aside>
    </div>  
    );
}
