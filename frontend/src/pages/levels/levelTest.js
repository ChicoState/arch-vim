import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { initVimMode } from "monaco-vim";
import VimEditor from "../../editor/vimEditor";

export default function LevelTest() {
    let editorVal = `#include <stdio.h>

void main() {
    printf("Hello World");
    return 0; 
}`
    return(
    <VimEditor value={editorVal}/>);
}