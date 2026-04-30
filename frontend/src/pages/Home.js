import Login from "../components/login";
import useCheckLevel from "../components/checkLevelPassed";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useEffect, useRef, useState } from "react";
import VimEditor from "../editor/vimEditor";

function LevelCheck({ levelNum = 0, levelDesc = "", theme = "dark" }) {
  const passed = useCheckLevel(levelNum);

  const passedClass =
    theme === "dark"
      ? "text-green-400 hover:text-green-300 text-xl font-medium"
      : "text-green-600 hover:text-green-700 text-xl font-medium";

  const defaultClass =
    theme === "dark"
      ? "text-gray-100 hover:text-gray-300 text-xl font-medium"
      : "text-slate-700 hover:text-slate-500 text-xl font-medium";

  return (
    <Link to={`/levels/${levelNum}`} className={passed ? passedClass : defaultClass}>
      Level {levelNum} - {levelDesc}
    </Link>
  );
}

export default function Home() {
  const [menu, setMenu] = useState("Welcome");
  const { theme } = useTheme();

  const titleRef = useRef(null);
  const containerRef = useRef(null);
  const chevronRef = useRef(null);

  useEffect(()=> {
    const container = containerRef.current;
    const titleCard = titleRef.current;
    const chevron = chevronRef.current;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const vh = window.innerHeight / 100;
      const fadeStart = 5 * vh;
      const fadeEnd = 70 * vh;
      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      titleCard.style.opacity = opacity;

      const chevronOpacity = Math.max(0, 1 - scrollY / (40 * vh));
      const rotation = scrollY * 0.3;
      chevron.style.opacity = chevronOpacity;
      chevron.style.transform = `rotate(${rotation}deg)`;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);


  const pageClass =
    theme === "dark"
      ? "bg-gray-950 text-white"
      : "bg-slate-50 text-slate-900";
      //bg-[#F0EAD6] for eggshell

  const cardClass =
    theme === "dark"
      ? [
          "bg-gray-950",
          "text-white",
          "border",
          "border-indigo-500/30",
          "shadow-[0_0_20px_rgba(99,102,241,0.7)]",
          "hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]",
          "hover:border-indigo-400/50",
          "backdrop-blur-sm",
          "transition",
          "duration-500",
          "ease-in-out"
        ].join(" ")
      : [
          "bg-white",
          "text-slate-900",
          "border-2",
          "border-indigo-200",
          "shadow-[0_0_40px_rgba(99,102,241,0.28),0_18px_40px_rgba(99,102,241,0.12)]",
          "hover:shadow-[0_0_55px_rgba(99,102,241,0.34),0_22px_48px_rgba(99,102,241,0.16)]",
          "hover:border-indigo-300",
          "backdrop-blur-sm",
          "transition",
          "duration-500",
          "ease-in-out"
        ].join(" ");

  const hrClass =
    theme === "dark" ? "border-gray-600" : "border-slate-200";

  const subtitleClass =
    theme === "dark" ? "text-white" : "text-slate-600";

  return (
    <div ref={containerRef} className={`${pageClass} py-6 h-screen overflow-y-scroll relative`}>
      <div className="fixed top-5 right-10 z-50">
        <Login />
      </div>

      {/* Title (static, fades when scrolled ) */}
      <div ref={titleRef} className="sticky top-0 h-screen z-0">        
          <h1 className="sticky font-mono text-center text-[11rem] pt-[35vh] font-bold leading-none">
          Arch-Vim
          </h1>

        <p className={`text-center text-2xl mt-4 ${subtitleClass}`}>
          Learn Vim, One step at a time
        </p>
      </div>

      {/* Bottom section for scrolling up CAN ADD bg-[color] TO THIS v DIV*/}
      <div className="relative z-10 -mt-[15vh] rounded-t-3xl pt-16 pb-16 min-h-screen">
        {/* Chevron pointing down (doesnt fade but whatever) */}
        <div ref={chevronRef} className="w-full flex flex-col items-center">
          <svg className="animate-bounce w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="min-h-[5vh]"/>

        <div className="w-full flex flex-col items-center">
          <div className="flex gap-24 justify-center flex-wrap text-center">
            <button onClick={() => setMenu("Welcome")} className="w-[5vw]">Welcome</button>
            <button onClick={() => setMenu("Levels")} className="w-[5vw]">Levels</button>
            <button onClick={() => setMenu("FAQ")} className="w-[5vw]">FAQ</button>
          </div>
          <div className="min-h-[1vh]"/>
          <hr className={`w-[75vw] mb-4 ${hrClass}`} />
        </div>
        <div className="min-h-[10vh]"/>

        {/* About Arch-vim + essentials */}
        { menu === "Welcome" &&
        <div className="mx-auto w-[75vw] grid grid-cols-[2fr_1fr] items-center h-full gap-16">
          <div className={`rounded-2xl p-8`}> {/* add a ${cardClass} for the border */}
            <h1 className="text-center text-7xl font-bold mb-8">What is Arch-Vim?</h1>
            <hr className={`mb-4 ${hrClass}`} />
            <p>
              Random text<br/>
              More text<br/>
              Even more text<br/>
              You wanted more text<br/>
              We go again<br/>
              Random text<br/>
              More text<br/>
              Even more text<br/>
              You wanted more text<br/>
            </p>
          </div>
          <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
            <h2 className="text-center mb-3 text-3xl font-bold">Basic Survival</h2>
            <hr className={`mb-4 ${hrClass}`} />
            <div className="pl-3 text-xl leading-10">
              <LevelCheck levelNum={1} levelDesc={"Learn Navigation"} theme={theme} /><br />
              <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"} theme={theme} /><br />
              <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"} theme={theme} /><br />
              <LevelCheck levelNum={4} levelDesc={"How to save files"} theme={theme} /><br />
              <LevelCheck levelNum={5} levelDesc={"Challenge!"} theme={theme} /><br />
            </div>
          </div>
        </div>
        }

        { menu === "Levels" && 
        <div>
          <div className="flex gap-16 justify-center flex-wrap mb-16">
            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">Navigation</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={1} levelDesc={"Learn Navigation"} theme={theme} /><br />
                <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"} theme={theme} /><br />
                <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"} theme={theme} /><br />
                <LevelCheck levelNum={4} levelDesc={"How to save files"} theme={theme} /><br />
                <LevelCheck levelNum={5} levelDesc={"Challenge!"} theme={theme} /><br />
              </div>
            </div>

            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">Some other stuff</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={6} levelDesc={"More Navigation"} theme={theme} /><br />
                <LevelCheck levelNum={7} levelDesc={"Even More Navigation!"} theme={theme} /><br />
                <LevelCheck levelNum={8} levelDesc={"Delete a line"} theme={theme} /><br />
                <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"} theme={theme} /><br />
                <LevelCheck levelNum={10} levelDesc={"Challenge!"} theme={theme} /><br />
              </div>
            </div>

            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">idk</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={11} levelDesc={"Basic Search"} theme={theme} /><br />
                <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"} theme={theme} /><br />
                <LevelCheck levelNum={13} levelDesc={"Jump between brackets"} theme={theme} /><br />
                <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"} theme={theme} /><br />
                <LevelCheck levelNum={15} levelDesc={"Challenge!"} theme={theme} /><br />
              </div>
            </div>
          </div>

          <div className="flex gap-16 justify-center flex-wrap">
            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">More Levels</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={16} levelDesc={"Jump to a character"} theme={theme} /><br />
                <LevelCheck levelNum={17} levelDesc={"Jump between paragraphs"} theme={theme} /><br />
                <LevelCheck levelNum={18} levelDesc={"Change a word"} theme={theme} /><br />
                <LevelCheck levelNum={19} levelDesc={"Replace a character"} theme={theme} /><br />
              </div>
            </div>

            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">Really Gotta separate these properly</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={20} levelDesc={"Repeat actions"} theme={theme} /><br />
                <LevelCheck levelNum={21} levelDesc={"Operators and motions"} theme={theme} /><br />
                <LevelCheck levelNum={22} levelDesc={"Text objects"} theme={theme} /><br />
                <LevelCheck levelNum={23} levelDesc={"Visual Mode"} theme={theme} /><br />
              </div>
            </div>

            <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
              <h2 className="text-center mb-3 text-3xl font-bold">hi</h2>
              <hr className={`mb-4 ${hrClass}`} />
              <div className="pl-3 text-xl leading-10">
                <LevelCheck levelNum={24} levelDesc={"Find and replace"} theme={theme} /><br />
                <LevelCheck levelNum={25} levelDesc={"Jump to marked locations"} theme={theme} /><br />
                <LevelCheck levelNum={26} levelDesc={"Macros"} theme={theme} /><br />
                <LevelCheck levelNum={27} levelDesc={"Challenge!"} theme={theme} /><br />
              </div>
            </div>
          </div>
        </div>
        }

        { menu === "FAQ" && 
        <div>
          <h1>
            We need to show what to do when vim files crash. Can probably render the editor with no win conditions and give it the text that prints when vim crashes, to simulate it
          </h1>
          <div className="mx-auto w-[75vw] grid grid-cols-[1fr_1fr] items-center h-full gap-16">
            <div className = "text-center">
              Test
              <br/>
              Explain what each thing does:
              <br/>
              (R)ecover: 
              <br/>
              (O)pen Read-Only:
              <br/>
              (E)dit Anyway:
              <br/>
              (Q)uit:
              <br/>
              (D)elete it:
              <br/>
            </div>

            <div>
              <VimEditor 
              width="650px" 
              height="300px" 
              defaultLang=""
              showResetLevel={false}
              showStatusNodes={false}
              showLineNumbers={"off"}
              moreOptions={{
                lineNumbersMinChars: 0,
    			      folding: false,
    			      glyphMargin: false,
    			      lineDecorationsWidth: 8,
				        padding: {
					        top: 8,
				        },
				        scrollBeyondLastLine: false,
                scrollbar: {
                  vertical: "hidden", 
                  verticalScrollbarSize: 0,
                },
                readOnly: true,
                selectionHighlight: false,
                occurrencesHighlight: false,
                renderLineHighlight: "none",
                cursorWidth: 0,
                cursorStyle: "line-thin",
              }}
              canWin={false}
              value={`ATTENTION
Found a swap file by the name ".filename.swp"
...
While opening file "filename"
dated: ...
\n
(1) Another program may be editing the same file.
(2) An idiot-proof version of Vim or the computer crashed.
\n
\n
If this is the case, use ":recover" to recover changes.
[(R)ecover], [(O)pen Read-Only], [(E)dit Anyway], [(Q)uit], [(D)elete it]`}
              />
            </div>
          </div>
        </div>
        }

      </div>

    </div>
  );
}