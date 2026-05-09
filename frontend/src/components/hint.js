import { useState } from "react";
import { useTheme } from "../ThemeContext";

export default function DropDown({ title, contents, moreClass = "" }) {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme();

    const wrapperClass =
        theme === "dark"
            ? [
                "rounded-lg",
                "bg-gray-950",
                "text-white",
                "overflow-hidden",
                "border",
                "border-indigo-500/30",
                "shadow-[0_0_8px_rgba(99,102,241,0.7)]",
                "hover:shadow-[0_0_16px_rgba(99,102,241,0.7)]",
                "backdrop-blur-sm",
                "transition",
                "duration-300",
                "ease-in-out"
              ].join(" ")
            : [
                "rounded-lg",
                "bg-white",
                "text-slate-900",
                "overflow-hidden",
                "border",
                "border-indigo-200",
                "shadow-[0_0_18px_rgba(99,102,241,0.18)]",
                "hover:shadow-[0_0_24px_rgba(99,102,241,0.24)]",
                "backdrop-blur-sm",
                "transition",
                "duration-300",
                "ease-in-out"
              ].join(" ");

    const buttonClass =
        theme === "dark"
            ? [
                "w-[15vw]",
                "text-left",
                "pl-4",
                "pr-[2px]",
                "py-3",
                "flex",
                "justify-between",
                "items-center",
                "hover:bg-gray-900",
                "transition-colors",
                "duration-300",
                "ease-in-out",
                "text-white",
                "text-xl",
                "font-medium"
              ].join(" ")
            : [
                "w-[15vw]",
                "text-left",
                "pl-4",
                "pr-[2px]",
                "py-3",
                "flex",
                "justify-between",
                "items-center",
                "hover:bg-slate-50",
                "transition-colors",
                "duration-300",
                "ease-in-out",
                "text-slate-900",
                "text-xl",
                "font-medium"
              ].join(" ");

    const contentClass =
        theme === "dark"
            ? [
                "px-4",
                "py-3",
                "text-gray-300",
                "border-t",
                "border-gray-700",
                "leading-7",
                "transition",
                "duration-300"
              ].join(" ")
            : [
                "px-4",
                "py-3",
                "text-slate-700",
                "border-t",
                "border-slate-200",
                "leading-7",
                "transition",
                "duration-300"
              ].join(" ");

    return (
        <div className={`${wrapperClass} ${moreClass}`}>
            <button onClick={() => setOpen(!open)} className={buttonClass}>
                <span>{title}</span>
                <span className={`mr-0.5 transition-transform duration-300 ${open ? "rotate-180" :""}`}>
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