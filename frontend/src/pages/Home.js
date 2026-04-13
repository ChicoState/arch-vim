import Login from "../components/login";
import useCheckLevel from "../components/checkLevelPassed";
import { Link } from "react-router-dom";

function LevelCheck({ levelNum=0, levelDesc="" }) {
  const passed = useCheckLevel(levelNum);
  return passed ? (
              <Link to={`/levels/${levelNum}`} className="text-green-500">Level {levelNum} - {levelDesc}</Link>
            ) : (
              <Link to={`/levels/${levelNum}`}>Level {levelNum} - {levelDesc}</Link>
            )
}

export default function Home() {
  //style={{ position: "relative", minHeight: "10vh", padding: "20px" }}
    return (
      <div className="bg-gray-950 p-6 min-h-screen text-white">
        <div className="fixed right-5 top-5">
          <Login />
        </div>
        <h1 className="font-mono text-center text-9xl pt-[20vh] font-bold">Arch-Vim</h1>
        <br/>
        <p className="text-center">Learn Vim, One step at a time</p>
        <div className="flex gap-20 justify-center pt-[25vh]">
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-950 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)] text-xl transition duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]">
            <h2 className="text-center mb-2">Intro</h2>
            <hr className="mb-4 border-gray-600"/>
            <div className="pl-5 text-base">
              <LevelCheck levelNum={1} levelDesc={"Learn Navigation"}/><br></br>
              <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"}/><br></br>
              <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"}/><br></br>
              <LevelCheck levelNum={4} levelDesc={"How to save files"}/><br></br>
              <LevelCheck levelNum={5} levelDesc={"Challenge!"}/><br></br>
            </div>
          </div>
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-950 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)] text-xl transition duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]">
            <h2 className="text-center mb-2">Intermediate</h2>
            <hr className="mb-4 border-gray-600"/>
            <div className="pl-5 text-base">
              <LevelCheck levelNum={6} levelDesc={"More Navigation"}/><br></br>
              <LevelCheck levelNum={7} levelDesc={"Even More Navigation!"}/><br></br>
              <LevelCheck levelNum={8} levelDesc={"Delete a line"}/><br></br>
              <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"}/><br></br>
              <LevelCheck levelNum={10} levelDesc={"Challenge!"}/><br></br>
            </div>
          </div>
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-950 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)] text-xl transition duration-500 ease-in-out hover:scale-110 hover:shadow-[0_0_30px_rgba(99,102,241,0.7)]">
            <h2 className="text-center mb-2">Advanced</h2>
            <hr className="mb-4 border-gray-600"/>
            <div className="pl-5 text-base">
              <LevelCheck levelNum={11} levelDesc={"Basic Search"}/><br></br>
              <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"}/><br></br>
              <LevelCheck levelNum={13} levelDesc={"Jump between brackets"}/><br></br>
              <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"}/><br></br>
              <LevelCheck levelNum={15} levelDesc={"Challenge!"}/><br></br>
            </div>
          </div>
        </div>
      </div>
    );
}