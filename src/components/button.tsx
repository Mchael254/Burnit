import type { ButtonProps } from "../types/button"

export function Button({ prop, onClick, disabled }: ButtonProps) {
    return(
        <button className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-3 text-lg rounded-xl 
        shadow-lg transition duration-300 cursor-pointer" onClick={onClick} disabled={disabled} >
            {prop}
        </button>

    )
}

export default Button
