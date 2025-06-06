import type { ButtonTabProps } from "../types/button";


function TabButton({prop, onClick}:ButtonTabProps){
    return(
         <button className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 border border-purple-600 rounded-lg py-2 px-2 cursor-pointer text-white" onClick={onClick}  >
            {prop}
        </button>

    )
}

export default TabButton
