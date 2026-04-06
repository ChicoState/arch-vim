import { useState } from "react";
import VimEditor from "../../editor/vimEditor";

export default function LevelTest() {
    const [won, setWin] = useState(false);
    const editorVal = `#include <stdio.h>

void main() {
    printf("Hello World");
    return 0; 
}`

    //the <> lets the {} be used for some reason
    //apparently its a react thing that lets you return multiple args together?
    return(
    <>
    <VimEditor 
    value={editorVal}
    commands={[":w", ":q"]}
    onWin={() => setWin(true)}/>
    {won && (<div>winner winner chicken dinner</div>)}
    </>
);
}