import { useNavigate } from "react-router-dom";
import Spinner from "../components/spinner";
import { useState } from "react";
import ResponseComponent from "../components/response";
import { useSnackbar } from "../hooks/snackBar";

import { setToken } from "../utils/token";
import { userLogin } from "../services/auth/login";
import { redirectToSignup } from "../utils/redirect";
import { getUserProfile } from "../services/auth/userProfile";
import { useUser } from "../hooks/useContext";
import { validateEmail } from "../utils/validators";



function Login() {
    const navigate = useNavigate();
    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useUser();

    const handleSignup = () => {
        redirectToSignup()
    }


    const getIsFormValid = () => {
        if (!email || !password) {
            showSnackbar('fill in all fields', 'error')
            return false;
        }
        if (!validateEmail(email)) {
            showSnackbar('check email', 'error');
            return false;
        }

        return true;
    }

    const clearForm = () => {
        setEmail("");
        setPassword("");
    };


    //login
    const handleLoginClick = async () => {
        if (!getIsFormValid()) {
            return
        }

        setLoading(true);
        const loginPayload = {
            email: email,
            password: password
        }
        // console.log(loginPayload);
        
        try {

            const loginData =  await userLogin(loginPayload);
            // console.log(loginData);
            
            showSnackbar('success', 'success');
            setToken(loginData.access_token, loginData.refresh_token)

            const profile = await getUserProfile();
            setUser(profile);

            setTimeout(() => {
                clearForm();
                navigate('/wallet')

            }, 2000);

        } catch (error) {
            const errorMessage = error && typeof error === "object" && "message" in error? (error as { message: string }).message
                    : "Something went wrong";
            showSnackbar(errorMessage, "error");
             setLoading(false);
            console.log(errorMessage);

        }

    }


    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 text-white">
            <h1 className="font-bold">Sign in</h1>
            <div className="flex flex-col justify-center bg-white border border-gray-300 rounded-lg w-[30vw] h-[60vh] p-6 shadow-lg mt-3">
                <div className="flex flex-col gap-4">
                    <label className="text-gray-700">Email:</label>
                    <input
                        type="email"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className="text-gray-700">Password:</label>
                    <input
                        type="password"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        disabled={loading}
                        type="button"
                        onClick={handleLoginClick}
                        className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-3 text-lg rounded-xl 
                                shadow-lg transition duration-300 cursor-pointer"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Signin"}
                    </button>

                    <p className="text-black">
                        Do you have an aaccount?{" "}
                        <a onClick={handleSignup} className="text-purple-700 hover:underline font-semibold cursor-pointer">
                            Sign up
                        </a>
                    </p>
                </div>

            </div>

            <ResponseComponent
                open={open}
                handleClose={handleClose}
                message={message}
                type={
                    ["success", "error", "warning"].includes(severity)
                        ? (severity as "success" | "error" | "warning")
                        : "error"
                }
            />

        </div>

    )
}

export default Login;