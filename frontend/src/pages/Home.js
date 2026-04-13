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
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-950 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)]">
            <h2 className="text-center text-xl mb-2">Easy</h2>
            <hr className="mb-4 border-gray-600"/>
            <div className="pl-5">
              <LevelCheck levelNum={1} levelDesc={"Learn Navigation"}/><br></br>
              <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"}/><br></br>
              <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"}/><br></br>
              <LevelCheck levelNum={4} levelDesc={"How to save files"}/><br></br>
              <LevelCheck levelNum={5} levelDesc={"Challenge!"}/><br></br>
            </div>
          </div>
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-800 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)]">
            Box test 2
          </div>
          <div className="w-[15vw] h-64 rounded-2xl bg-gray-800 p-6 text-white shadow-[0_0_20px_rgba(99,102,241,0.7)]">
            Box test 3
          </div>
        </div>
      </div>
    );
}