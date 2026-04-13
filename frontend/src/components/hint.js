import { useState } from "react";

export default function DropDown({ title, contents, moreClass = "" }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`rounded-lg bg-gray-950 overflow-hidden shadow-[0_0_5px_rgba(99,102,241,0.7)] hover:shadow-[0_0_15px_rgba(99,102,241,0.7)] ${moreClass}`}>
            <button onClick={() => setOpen(!open)}
                className="w-[15vw] text-left px-4 py-3 flex justify-between items-center hover:bg-gray-900 trainsition-colors ">
                <span>{title}</span>
                <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                    V
                </span>
            </button>

            <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
                <div className="px-4 py-3 text-gray-400 border-t border-gray-700">
                    {contents}
                </div>
            </div>
        </div>
    )
}