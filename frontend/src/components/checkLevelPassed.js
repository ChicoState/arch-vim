import { loadProgress } from "../progress";
import { useState, useEffect } from "react";

export default function useCheckLevel (levelNum = 0){
    const [passed, setPassed] = useState(false);
    useEffect(() => {
        loadProgress().then(
            data=>{
                if (data[`level_${levelNum}`]?.passed) 
                    setPassed(true);
                });
            }, [levelNum]);
    return(passed)
}

// export function getAllLevels() {
//     return loadProgress()
// }