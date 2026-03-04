import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import VimEditor from "../editor/vimEditor";

export default function Level3() {
    const [passed, setPassed] = useState(false);
    const [enteredInsert, setEnteredInsert] = useState(false);
    const alreadyPassed = useRef(false);


    const starterText =
`// Level 3: INSERT MODE
// Press i to enter INSERT mode.
// Type VIM inside the brackets.
// Press Esc to go back to NORMAL mode.
//
// Objective: Put VIM inside [ ] below.

int main() {
  // Type here: [          ]
  return 0;
}
`;
}