import { useParams } from "react-router-dom"
import VimEditor from "../../editor/vimEditor";

export default function Level() {
    const { id } = useParams(); //id for levels/:id

    return(
        <div>
            <h1>Level {id}</h1>
            <VimEditor/ >
        </div>
    )

    
}


//Ignore, this is for putting all levels in one file.