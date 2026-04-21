import { useState, useEffect } from "react";
import VimEditor from "../../editor/vimEditor";
import { loadProgress } from "../../progress";
import Sidebar from "../../components/sidebar";
import DropDown from "../../components/hint";
import PassedLevel from "../../components/passedLevel";
import { useTheme } from "../../ThemeContext";

export default function Level4() {
    const levelNum = 4;
    const [passed, setPassed] = useState(false);
    const { theme } = useTheme();

    const defaultValue =
`#include <stdio.h>

int main() {
  printf("Hello World");
return 0;
}
`;

    useEffect(() => {
        loadProgress().then(data => {
            if (data[`level_${levelNum}`]?.passed)
                setPassed(true);
        });
    }, []);

    const pageClass =
        theme === "dark"
            ? "flex min-h-screen bg-gray-950 text-gray-200"
            : "flex min-h-screen bg-slate-50 text-slate-900";

    const sideClass =
        theme === "dark"
            ? "w-[16vw] bg-gray-950 p-4"
            : "w-[16vw] bg-white p-4 border-r border-slate-200";

    const rightSideClass =
        theme === "dark"
            ? "w-[16vw] bg-gray-950 p-4"
            : "w-[16vw] bg-white p-4 border-l border-slate-200";

    const hrClass =
        theme === "dark"
            ? "mb-4 border-gray-600 w-96 ml-16"
            : "mb-4 border-slate-300 w-96 ml-16";

    return (
        <div className={pageClass}>

            {/* LEFT SIDEBAR */}
            <aside className={sideClass}>
                <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <aside className="flex-1 pt-10 p-4">
                <div style={{ padding: "10px" }}>
                    <div className="ml-[15vw] mb-10">
                        <h1 className="text-7xl mb-2 pl-16">Level 4</h1>
                        <h3 className="pl-16 text-4xl mb-2">How to save a file</h3>
                        <hr className={hrClass} />
                        <p className="pl-28">
                            After escaping to Normal mode, type <kbd>:w</kbd> and press Enter to save the file.
                            <br /><br />
                            Objective: Run the save command to pass.
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

                    {passed && (
                        <div className="flex items-center justify-center">
                            <PassedLevel levelNum={levelNum} />
                        </div>
                    )}
                </div>
            </aside>

            {/* RIGHT SIDEBAR */}
            <aside className={rightSideClass}>
                <p className="text-center text-2xl mb-4">Hints</p>
                <DropDown
                    title={"Combine Commands"}
                    contents={"You can combine the write and quite commands into a single command, :wq"}
                />
            </aside>

        </div>
    );
}