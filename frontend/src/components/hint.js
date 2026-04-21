import { useState } from "react";
import { useTheme } from "../ThemeContext";

export default function DropDown({ title, contents, moreClass = "" }) {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const wrapperClass =
        theme === "dark"
            ? "rounded-lg bg-gray-950 text-white overflow-hidden shadow-[0_0_5px_rgba(99,102,241,0.7)] hover:shadow-[0_0_15px_rgba(99,102,241,0.7)]"
            : "rounded-lg bg-white text-slate-900 overflow-hidden border border-slate-200 shadow-[0_10px_30px_rgba(99,102,241,0.15)]";

    const buttonClass = 
        theme === "dark" 
            ? "w-[15vw] text-left px-4 py-3 flex justify-between items-center hover:bg-gray-900 transition-colors text-white"
            : "w-[15vw] text-left px-4 py-3 flex justify-between items-center hover:bg-slate-100 transition-colors text-slate-900";

    const contentClass =
        theme === "dark"
            ? "px-4 py-3 text-gray-300 border-t border-gray-700"
            : "px-4 py-3 text-slate-700 border-t border-slate-200";

    return (
        <div className={`${wrapperClass} ${moreClass}`}>
            <button onClick={() => setOpen(!open)} className={buttonClass}>
                <span>{title}</span>
                <span className={`mr-3 transition-transform duration-300 ${open ? "rotate-180" :""}`}>
                    ▼
                </span>
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
                <div className={contentClass}>
                    {contents}
                </div>
            </div>
        </div>
    );
}