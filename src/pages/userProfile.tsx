import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";
import ResponseComponent from "../components/response";
import { useSnackbar } from "../hooks/snackBar";
import { saveProfile } from "../services/auth/saveProfile";
import Spinner from "../components/spinner";

import React from "react";
import BasicModal from "../components/modal";
import { deleteUser } from "../services/auth/deleteUser";
import { redirectToLanding } from "../utils/redirect";
import { clearToken } from "../utils/token";
import { useUser } from "../hooks/useContext";
import { validateEmail } from "../utils/validators";



export default function UserProfileForm() {
    const { user } = useUser();
    console.log(user);
    

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        creation_timestamp: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const isSaveProfileValid = () => {
        if (formData.name.trim() === '' || formData.email.trim() === '' || password.trim() === '') {
            showSnackbar('fill in all fields', 'error')
            return false;
        }
        if (!validateEmail(formData.email)) {
            showSnackbar('check email', 'error');
            return false;
        }

        return true;
    }

    const handleSave = async () => {
        if (!isSaveProfileValid()) {
            return
        }

        const walletPayload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: password.trim()
        }

        console.log(walletPayload);
        setLoading(true)

        try {
            const updateData = await saveProfile(walletPayload)
            console.log(updateData);

            showSnackbar('success', 'success');
            setLoading(false)
            setEditing(false);

        } catch (error) {
            const errorMessage = error && typeof error === "object" && "message" in error ? (error as { message: string }).message
                : "Something went wrong";
            showSnackbar(errorMessage, "error");
            setLoading(false);
            console.log(errorMessage);

        }

    };

    const handleCancel = () => {
        if (!formData.creation_timestamp || !formData.email || !formData.name) {
            showSnackbar('fields cannot be empty', 'warning');
            return
        }
        setEditing(false);
    };

    const handleDelete = async () => {
        setLoading(true)

        try {
            const response = await deleteUser()
            console.log(response.data);

            showSnackbar('account deleted successfully', 'success')
            setLoading(false)
            clearToken()
            redirectToLanding()

        } catch (error) {
            const errorMessage = error && typeof error === "object" && "message" in error ? (error as { message: string }).message
                : "Something went wrong";
            showSnackbar(errorMessage, "error");
            setLoading(false);
            console.log(errorMessage);

        }

    }

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                creation_timestamp: user.creation_timestamp || '',
            });
        }
    }, [user]);

    const [openWalletModal, setOpenWalletModal] = React.useState(false);
    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [isEditing, setEditing] = useState(false)
    const [password, setPassword] = useState('')

    if (user === undefined) {
        return <div><Spinner size={20} color="inherit" /></div>; 
    }
    if (user === null) {
        // return <Navigate to="/login" replace />;
    }


    return (
        <div className='min-h-screen w-[80vw] flex flex-col items-center justify-center'>
            {!isEditing ? (

                <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-6 shadow-lg w-[55vw] h-[70vh] flex flex-col items-center justify-center rounded-lg">
                    <h1 className="text-white mb-7 text-xl">Profile</h1>
                    <div className="flex flex-col items-center justify-center space-y-2 text-purple-100 bg-white rounded-lg w-[80%] h-[30vh]">
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Name:</p>
                            <p className="text-black text-lg">{formData.name}</p>
                        </div>
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Email:</p>
                            <p className="text-black text-lg">{formData.email}</p>
                        </div>
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Member Since:</p>
                            <p className="text-black"> {formData.creation_timestamp ? formatDate(formData.creation_timestamp) : ''}</p>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-6 shadow-lg w-[55vw] h-[70vh] flex flex-col items-center justify-center rounded-lg">
                    <h1 className="text-white mb-7 text-xl">Edit Profile</h1>
                    <div className="flex flex-col items-center justify-center space-y-2 text-purple-100 bg-white rounded-lg w-[80%] h-[30vh]">
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Name:</p>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-black text-lg bg-transparent border-none focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Email:</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-black text-lg bg-transparent border-none focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-between p-2 w-[90%] border border-outline-primary">
                            <p className="text-black">Password:</p>
                            <input
                                type="text"
                                className="rounded-lg p-2 text-black text-black text-lg bg-transparent border-none focus:outline-none"
                                placeholder="new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
            )}

            {!isEditing ? (


                <div className="flex space-x-4 mt-7">
                    <button
                        className="cursor-pointer px-6 py-3 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                        onClick={() => setEditing(true)}
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => setOpenWalletModal(true)}
                        className="px-6 cursor-pointer py-3 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 hover:bg-red-500 text-white text-lg rounded-xl ml-20"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Delete Account"}
                    </button>
                </div>
            ) : (
                <div className="flex space-x-4 mt-7">
                    <button
                        onClick={handleSave}
                        className="cursor-pointer px-6 py-3 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Save"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-6 cursor-pointer py-3 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 hover:bg-red-500 text-white text-lg rounded-xl"
                    >
                        Cancel
                    </button>
                </div>
            )}
            <BasicModal
                open={openWalletModal}
                setOpen={setOpenWalletModal}
                title=""
                description="">
                <div className="mt-10 flex flex-col items-center  justify-around h-[30vh]">
                    <h1>Are you sure you want to delete your account?</h1>
                    <button
                        onClick={handleDelete}
                        className="w-[40%] cursor-pointer px-4 py-2 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Delete"}
                    </button>
                    <button
                        onClick={() => setOpenWalletModal(false)}
                        className=" w-[40%] px-4 cursor-pointer py-2 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 hover:bg-red-500 text-white text-lg rounded-xl"
                    >
                        Cancel
                    </button>


                </div>

            </BasicModal>
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