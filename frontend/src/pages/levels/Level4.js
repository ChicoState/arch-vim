import { useState } from "react";
import VimEditor from "../../editor/vimEditor";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import { useTheme } from "../../ThemeContext";
import useCheckLevel from "../../components/checkLevelPassed";

export default function Level4() {
    const levelNum = 4;
    const [passed, setPassed] = useState(useCheckLevel(levelNum));
    const { theme } = useTheme();

    const defaultValue =
`#include <stdio.h>

int main() {
  printf("Hello World");
return 0;
}
`;


    const pageClass =
        theme === "dark"
            ? "flex min-h-screen bg-gray-950 text-gray-200"
            : "flex min-h-screen bg-slate-50 text-slate-900";

    const sideClass =
        theme === "dark"
            ? "w-[19vw] min-w-[320px] p-4"
            : "w-[19vw] min-w-[320px] p-4";

    const rightSideClass =
        theme === "dark"
            ? "w-[18vw] min-w-[280px] bg-gray-950 p-4"
            : "w-[18vw] min-w-[280px] bg-white p-4 border-l border-slate-200";

    const hrClass =
        theme === "dark"
            ? "mb-4 border-gray-600 w-96"
            : "mb-4 border-slate-300 w-96";

    return (
        <div className={pageClass}>

            {/* LEFT SIDEBAR */}
            <aside className={sideClass}>
                <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="w-[1100px] max-w-full mx-auto mb-8 text-left">
                        <h1 className="text-6xl mb-2">Level 4</h1>
                        <h3 className="text-4xl mb-2">How to save a file</h3>
                        <hr className={hrClass} />
                        <p className="text-lg leading-8">
                            After escaping to Normal mode, type <kbd>:w</kbd> and press Enter to save the file.
                            <br /><br />
                            <span className="font-medium">
                                Objective: Run the save command to pass.
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center justify-center">
                        <VimEditor
                            level={levelNum}
                            value={defaultValue}
                            possibleCommands={[":w", ":wq"]}
                            onWin={() => setPassed(true)}
                        />
                    </div>
                </div>
            </main>

            {/* RIGHT SIDEBAR */}
            <aside className={rightSideClass}>
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown
                    title={"Combine Commands"}
                    contents={"You can combine the write and quite commands into a single command, :wq"}
                />
                {passed && (
                    <div className="mt-6">
                        <PassedLevel levelNum={levelNum} />
                    </div>
                )}
            </aside>

        </div>
    );
}