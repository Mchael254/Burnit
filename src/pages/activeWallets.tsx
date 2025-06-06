import React from "react";
import { getWallets } from "../services/wallets/getWallets";
import type { WalletTypes } from "../types/walletTypes";
import { getExpiryDate, isWalletExpired } from "../utils/wallets"
import { useEffect, useState } from "react";
import BasicModal from "../components/modal";
import Spinner from "../components/spinner";
import { useSnackbar } from "../hooks/snackBar";
import ResponseComponent from "../components/response";

function ActiveWallets() {
    const [activeWallets, setActiveWallets] = useState<WalletTypes[]>([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [openDeleteModal, setDeleteModal] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();

    const [token, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [phone_number, setPhonenumber] = useState('');

    const handleDeposit = () => {
        setOpenModal(true)

    }

    const handleDepositWallet = () => {
        setLoading(true)

        if (token === '' || amount === '' || phone_number === '') {
            showSnackbar('all fields are required', 'warning')
            setLoading(false)
            return

        }
        setLoading(true)

    }


    const handleCancelDeposit = () => {
        setOpenModal(false)
    }

    const handleDelete = () => {
        setDeleteModal(true)

    }

    const handleDeleteWallet = async () => {

    }

    const handleCancelDelete = () => {
        setDeleteModal(false)
    }

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await getWallets();

                const now = new Date();
                const active: WalletTypes[] = [];

                data.forEach((wallet: WalletTypes) => {
                    const expiryDate = new Date(getExpiryDate(wallet.active_period));
                    const isExpired = isWalletExpired(wallet.active_period);
                    if (expiryDate > now && !isExpired) {
                        active.push(wallet);
                    }
                });

                setActiveWallets(active);

            } catch (error) {
                console.error("Failed to fetch wallets:", error);
            }
        };
        fetchWallet();
    }, []);

    return (
        <div className="min-h-screen w-[80vw] border border-red-50 flex flex-col items-center justify-center">
            <div className="flex flex-col text-center justify-center items-center w-[70vw] h-[95vh] border border-red-50 rounded-lg">
                <h1 className="text-white text-lg mb-3 font-bold">Active Wallets</h1>
                <div className="h-[80vh] w-[65vw] mt-4 flex flex-wrap overflow-y-auto items-center justify-around">
                    {activeWallets.length === 0 ? (
                        <p className="text-purple-300 text-lg">No active wallets</p>
                    ) : (
                        activeWallets.map((wallet: WalletTypes) => (
                            <div
                                key={wallet.id}
                                className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 border border-purple-600 h-[35vh] w-[50vh] rounded-lg mx-2 flex flex-col justify-around items-center mb-4 p-4 shadow-lg shadow-purple-900/50 relative"
                            >
                                <div className="flex">
                                      <h3 className="text-white font-bold text-lg">{wallet.name}</h3>

                                </div>
                              
                                <div className="flex justify-between w-full items-center mt-2 text-xs text-purple-300">
                                    <span>
                                        Created: {new Date(wallet.creation_timestamp).toLocaleDateString()}
                                    </span>
                                    <span>Expires: {getExpiryDate(wallet.active_period)}</span>
                                </div>
                                <div className="w-full mt-2">
                                    <h4 className="text-purple-300 font-semibold text-sm mb-1">Tokens</h4>
                                    {Array.isArray(wallet.available_tokens) ? (
                                        wallet.available_tokens.map((token, index) => (
                                            <div key={index} className="flex justify-between text-white text-sm">
                                                <span>{token.name}</span>
                                                <span className="text-purple-200">{token.amount}</span>
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                                <div className="flex justify-around w-full">
                                    <button className="text-red-300 text-xs cursor-pointer"
                                        onClick={() => { handleDelete() }}>
                                        Delete</button>
                                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-lg shadow-md hover:shadow-purple-500/50 font-semibold cursor-pointer"
                                        onClick={() => { handleDeposit() }}>
                                        Deposit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <BasicModal
                open={openModal}
                setOpen={setOpenModal}
                title=""
                description="Deposit">

                <div className="flex flex-col gap-3">

                    <label className="text-gray-700">Token:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        value={token}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="text-gray-700 ">Amount:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <label className="text-gray-700 ">Phone number:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        value={phone_number}
                        onChange={(e) => setPhonenumber(e.target.value)}
                    />

                    <div className="flex justify-center space-x-4 mt-7">
                        <button
                            onClick={handleDepositWallet}
                            className="cursor-pointer px-6 py-3 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                        >
                            {loading ? <Spinner size={20} color="inherit" /> : "Save"}
                        </button>
                        <button
                            onClick={handleCancelDeposit}
                            className="px-6 cursor-pointer py-3 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 hover:bg-red-500 text-white text-lg rounded-xl"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </BasicModal>
            <BasicModal
                open={openDeleteModal}
                setOpen={setDeleteModal}
                title=""
                description="">
                <div>
                    <h1 className="text-danger">Are you sure you want to delete?</h1>
                    <div className="flex justify-center space-x-4 mt-7">
                        <button
                            onClick={handleDeleteWallet}
                            className="cursor-pointer px-6 py-3 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                        >
                            {loading ? <Spinner size={20} color="inherit" /> : "Save"}
                        </button>
                        <button
                            onClick={handleCancelDelete}
                            className="px-6 cursor-pointer py-3 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 hover:bg-red-500 text-white text-lg rounded-xl"
                        >
                            Cancel
                        </button>
                    </div>

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

export default ActiveWallets