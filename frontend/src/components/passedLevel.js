import { Link } from "react-router-dom";

export default function PassedLevel({ levelNum = 0 }) {
    const x = levelNum + 1

    return(
        <div className="p-4 bg-gray-950 shadow-[0_0_20px_rgba(2,218,0,0.7)] rounded-2xl w-[15vw]">
            <h3 className="text-[#4caf50] text-center text-xl mb-2">You passed!</h3>
            <p style = {{ color: "white" }}>
                Move on to the next level:
            <Link to={`/levels/${x}`} style={{ marginLeft: "8px", color: "#4caf50" }}> Level {x} </Link>
            </p>
            <p style = {{ color: "white" }}>
                Or go back home:
            <Link to="/" style= {{ marginLeft: "8px"}}> Home </Link>
            </p>
        </div>
    )

}