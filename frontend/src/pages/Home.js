import Login from "../components/login";
import useCheckLevel from "../components/checkLevelPassed";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { useEffect, useRef, useState } from "react";

function ingestLevelInfo() {}

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
      {levelDesc}
    </Link>
  );
}

export default function Home() {
  const [menu, chooseMenu] = useState("Levels");
  const { theme } = useTheme();

  const heroRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(()=> {
    const container = containerRef.current;
    const hero = heroRef.current;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const vh = window.innerHeight / 100;
      const fadeStart = 5 * vh;
      const fadeEnd = 70 * vh;
      const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      hero.style.opacity = opacity;
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
      ? "bg-gray-950 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]"
      : "bg-white text-slate-900 border border-slate-200 shadow-[0_10px_30px_rgba(99,102,241,0.15)] hover:shadow-[0_14px_36px_rgba(99,102,241,0.22)]";

  const hrClass =
    theme === "dark" ? "border-gray-600" : "border-slate-200";

  const subtitleClass =
    theme === "dark" ? "text-white" : "text-slate-600";

  return (
    <div ref={containerRef} className={`${pageClass} py-6 h-screen overflow-y-scroll relative`}>
      <div className="fixed top-5 right-10 z-50">
        <Login />
      </div>
      <div ref={heroRef} className="sticky top-0 h-screen z-0">        
          <h1 className="sticky font-mono text-center text-[11rem] pt-[35vh] font-bold leading-none">
          Arch-Vim
          </h1>

        <p className={`text-center text-2xl mt-4 ${subtitleClass}`}>
          Learn Vim, One step at a time
        </p>
      </div>

      <div className="relative z-10 -mt-[10vh]  rounded-t-3xl pt-16 pb-16 min-h-screen">
        
        {/* Chevron pointing down (doesnt fade but whatever) */}
        <div className="w-full flex flex-col items-center">
          <svg className="animate-bounce w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div><br/>

        {/* About Arch-vim + essentials */}
        <div className="mx-auto w-[75vw] grid grid-cols-[2fr_1fr] gap-16">
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
        <div className="min-h-[20vh]"/>

        <div className="w-full flex flex-col items-center">
          <div className="flex gap-20 justify-center flex-wrap">
            <h1>Test</h1>
          </div>
          <hr className={`mb-4 ${hrClass}`} />
        </div>
        <div className="min-h-[5vh]"/>



        <div className="flex gap-16 justify-center flex-wrap">
          <div className={`w-[24vw] h-[15vh] min-w-[320px] min-h-[320px] rounded-2xl p-8 text-2xl transition duration-500 ease-in-out hover:scale-105 ${cardClass}`}>
            <h2 className="text-center mb-3 text-3xl font-bold">Intro</h2>
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
            <h2 className="text-center mb-3 text-3xl font-bold">Intermediate</h2>
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
            <h2 className="text-center mb-3 text-3xl font-bold">Advanced</h2>
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

      </div>

    </div>
  );
}