import { useNavigate } from "react-router-dom"
import Button from "../components/button"


function Landing() {
    const navigate = useNavigate();

    return (

        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 text-white">
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl text-center mb-8">
                The wallet that helps you burn bad spending habits. Set limits. Stay disciplined. Save smarter.
            </p>
            
            <Button prop="Get Started" onClick={() => {
                navigate("/signup");

            }} />

        </div>
    )

}

export default Landing