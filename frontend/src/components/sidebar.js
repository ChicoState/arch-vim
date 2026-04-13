import { Link } from "react-router-dom";
import useCheckLevel from "../components/checkLevelPassed";
import Login from "./login";

function callBackend() {
    
}

function LevelCheck({ levelNum=0, levelDesc="" }) {
  const passed = useCheckLevel(levelNum);
  return passed ? (
              <Link to={`/levels/${levelNum}`} className="text-green-500 hover:text-green-700 text-[0.75vw]">Level {levelNum} - {levelDesc}</Link>
            ) : (
              <Link to={`/levels/${levelNum}`} className="hover:text-gray-400 text-[0.75vw]">Level {levelNum} - {levelDesc}</Link>
            )
}

export default function Sidebar() {
    
    return(
        <div className="w-[15vw] h-[96vh] rounded-2xl bg-gray-950 shadow-[0_0_20px_rgba(99,102,241,0.7)] p-4 relative text-xl">
            <h1 className="text-center text-2xl mb-2">Navigation</h1>
            <hr className="mb-4 border-gray-600"></hr>
            <Link to="/" className="mb-4 text-xl">Home</Link>
            <h2>Levels</h2>
            <h3 className="pl-4">Intro</h3>
            <div className="pl-8 mb-2">
                <LevelCheck levelNum={1} levelDesc={"Learn Navigation"}/><br></br>
                <LevelCheck levelNum={2} levelDesc={"How to exit a vim file"}/><br></br>
                <LevelCheck levelNum={3} levelDesc={"Insert Mode and typing"}/><br></br>
                <LevelCheck levelNum={4} levelDesc={"How to save files"}/><br></br>
                <LevelCheck levelNum={5} levelDesc={"Challenge!"}/><br></br>
            </div>
            <br></br>
            <h3 className="pl-4">Intermediate</h3>
            <div className="pl-8 mb-2">
                <LevelCheck levelNum={6} levelDesc={"More Navigation"}/><br></br>
                <LevelCheck levelNum={7} levelDesc={"Even More Navigation!"}/><br></br>
                <LevelCheck levelNum={8} levelDesc={"Delete a line"}/><br></br>
                <LevelCheck levelNum={9} levelDesc={"Undo your mistakes"}/><br></br>
                <LevelCheck levelNum={10} levelDesc={"Challenge!"}/><br></br>
            </div>
            <br></br>
            <h3 className="pl-4">Advanced</h3>
            <div className="pl-8">
                <LevelCheck levelNum={11} levelDesc={"Basic Search"}/><br></br>
                <LevelCheck levelNum={12} levelDesc={"Comprehensive Commands"}/><br></br>
                <LevelCheck levelNum={13} levelDesc={"Jump between brackets"}/><br></br>
                <LevelCheck levelNum={14} levelDesc={"Jump up and down the file"}/><br></br>
                <LevelCheck levelNum={15} levelDesc={"Challenge!"}/><br></br>
            </div>
            <div className="absolute left-5 bottom-5">
                <Login />
            </div>
        </div>
    )
}