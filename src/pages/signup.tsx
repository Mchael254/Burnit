import { useState } from "react";
import { validateEmail } from "../utils/validators";
import ResponseComponent from "../components/response";
import { useSnackbar } from "../hooks/snackBar";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/spinner";
import { registerUser } from "../services/auth/signup";
import { redirectToLogin } from "../utils/redirect";


const PasswordErrorMessage = () => (
    <p className="FieldError text-black">
        Password should have at least 8 characters
    </p>
);

function Signup() {
    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const [names, setNames] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });
    const navigate = useNavigate();
    const handleLogin = () => {
        redirectToLogin()
    }

    const getIsFormValid = () => {
        if (!email || !names || !password) {
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
        setNames("");
        setEmail("");
        setPassword({ value: "", isTouched: false });
    };

    //signup
    const handleRegisterClick = async () => {
        if (!getIsFormValid()) {
            return;
        }

        setLoading(true);

        const registerPayload = {
            name: names,
            email: email,
            password: password.value,
        }

        try {
            await registerUser(registerPayload);
            showSnackbar("Signup successful!", "error");

            showSnackbar('success', 'success');

            setTimeout(() => {
                clearForm();
                navigate('/login')

            }, 2000);

        } catch (error) {
            const errorMessage =
                error && typeof error === "object" && "message" in error
                    ? (error as { message: string }).message
                    : "Something went wrong";
            showSnackbar(errorMessage, "error");
            console.log(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 text-white">
            <h1 className="font-bold">Let us get you started</h1>
            <div className="flex flex-col bg-white border border-gray-300 rounded-lg w-[30vw] h-[70vh] p-6 shadow-lg mt-3">
    
                <div className="flex flex-col gap-4">
                    <label className="text-gray-700">Name:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        placeholder="Your name"
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                    />

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
                        value={password.value}
                        onChange={(e) =>
                            setPassword({ ...password, value: e.target.value, isTouched: true })
                        }
                    />
                    {password.isTouched && password.value.length < 8 && <PasswordErrorMessage />}

                    <button
                        disabled={loading}
                        type="button"
                        onClick={handleRegisterClick}
                        className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-3 text-lg rounded-xl 
                                shadow-lg transition duration-300 cursor-pointer"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Signup"}
                    </button>

                    <p className="text-black">
                        Already have an account?{" "}
                        <a onClick={handleLogin} className="text-purple-700 hover:underline font-semibold cursor-pointer">
                            Sign in
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
    );
}
export default Signup;
