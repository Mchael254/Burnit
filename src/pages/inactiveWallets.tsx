import { getWallets } from "../services/wallets/getWallets";
import type { WalletTypes } from "../types/walletTypes";
import { getExpiryDate, isWalletExpired } from "../utils/wallets";
import { useEffect, useState } from "react";

function InactiveWallets() {
    const [inactiveWallets, setInactiveWallets] = useState<WalletTypes[]>([]);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await getWallets();

                const inactive = data.filter((wallet: WalletTypes) => {
                    const isExpired = isWalletExpired(wallet.active_period);
                    const isDeleted = wallet.is_deleted;
                    return isExpired || isDeleted;
                });

                setInactiveWallets(inactive);

            } catch (error) {
                console.error("Failed to fetch wallets:", error);
            }
        };
        fetchWallet();
    }, []);

    return (
        <div className="min-h-screen w-[80vw] border border-red-50 flex flex-col items-center justify-center">
            <div className="flex flex-col text-center justify-center items-center w-[70vw] h-[95vh] border border-red-50 rounded-lg">
                <h1 className="text-white text-lg mb-3 font-bold">Expired Wallets</h1>
                <div className="h-[80vh] w-[65vw] mt-4 flex flex-wrap overflow-y-auto items-center justify-around">
                    {inactiveWallets.length === 0 ? (
                        <p className="text-purple-300 text-lg">No inactive wallets</p>
                    ) : (
                        inactiveWallets.map((wallet: WalletTypes) => (
                            <div
                                key={wallet.id}
                                className="bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 border border-gray-500 h-[25vh] w-[45vh] rounded-lg mx-2 flex flex-col justify-around items-center mb-4 p-4 shadow-lg shadow-gray-900/50 relative"
                            >
                                <h3 className="text-white font-bold text-lg">{wallet.name}</h3>
                                <div className="flex justify-between w-full items-center mt-2 text-xs text-gray-300">
                                    <span>
                                        Created: {new Date(wallet.creation_timestamp).toLocaleDateString()}
                                    </span>
                                    <span>Expired: {getExpiryDate(wallet.active_period)}</span>
                                </div>
                                <div className="w-full">
                                    <div className="flex justify-between text-white my-1">
                                        <span className="font-medium">Balance</span>
                                        <span className="text-gray-200">0.00001</span>
                                    </div>
                                </div>
                                <div className="flex justify-around w-full">
                                    <button className="text-red-300 text-xs cursor-pointer">Remove</button>
                                    <button className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded-lg shadow-md hover:shadow-gray-500/50 font-semibold cursor-pointer">
                                        Unfund
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default InactiveWallets;