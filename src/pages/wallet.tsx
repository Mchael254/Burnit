
import * as React from 'react';
import BasicModal from "../components/modal";
import { useEffect, useState } from "react";
import Spinner from "../components/spinner";
import { useSnackbar } from "../hooks/snackBar";
import ResponseComponent from "../components/response";
import { createWalletApi } from "../services/wallets/createWallet";
import type { CreateWalletPayload } from "../types/wallet";
import { formatDateTimeWithTZ } from "../utils/formatDate";
import { } from "../utils/token";
import { Button } from '../components/button';
import TabButton from '../components/tabButton';
import ActiveWallets from './activeWallets';
import { handleLogoutUtil } from '../utils/logout';
import InactiveWallets from './inactiveWallets';
import { getWallets } from '../services/wallets/getWallets';
import { isWalletExpired } from '../utils/wallets';
import type { WalletTypes } from '../types/walletTypes';
import { redirectToLanding } from '../utils/redirect';
import UserProfileForm from './userProfile';
import { validateMpesaNumbers } from '../utils/validators';
import ManageContact from './contact';

// Tabs
const TabPanel = ({ children, value, index }: { children: React.ReactNode, value: number, index: number }) => {
    return (
        <div hidden={value !== index}>
            {value === index && children}
        </div>
    );
};


function Wallet() {

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                setLoadingWallets(true);
                const data = await getWallets();

                //filterwallets
                const active = data.filter((wallet: WalletTypes) => {
                    return !isWalletExpired(wallet.active_period) && !wallet.is_deleted;
                });

                setHasActiveWallet(active.length > 0);

                if(active.length > 0){
                    setActiveTab(1)
                }
            } catch (error) {
                console.error("Failed to fetch wallets:", error);
                showSnackbar('Failed to load wallets', 'error');
            } finally {
                setLoadingWallets(false);
            }
        };
        fetchWallets();
    }, []);

 
    const [hasActiveWallet, setHasActiveWallet] = useState(false);
    const [loadingWallets, setLoadingWallets] = useState(true);

    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
    const [activeTab, setActiveTab] = useState(1);

    //wallet payload
    const [openWalletModal, setOpenWalletModal] = React.useState(false);
    const [name, setName] = useState('');
    const [mpesaNumbers, setMpesaNumbers] = useState<string[]>([]);
    const [walletPurpose, setWalletPurpose] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);


    //logout
    const handleLogout = async () => {
        await handleLogoutUtil(showSnackbar, redirectToLanding);
    }

    const isContactValid = () => {
        const result = validateMpesaNumbers(mpesaNumbers);
        if (!result.valid) {
            showSnackbar(result.message || 'phone numbers', 'error');
            return false;
        }
        return true;
    };

    const checkWalletInputs = () => {
        if (!name || !mpesaNumbers || !startDate || !endDate) {
            showSnackbar('check all fields', 'warning');
            return false;
        }
        if (startDate > endDate || startDate === endDate) {
            showSnackbar('end date comes after start date', 'warning')
            return false;
        }
        if (!isContactValid()) {
            setLoading(false)
            return
        }

        return true

    }

    const handleCreateWallet = async () => {
        if (!checkWalletInputs()) {
            return
        }

        const walletPayload: CreateWalletPayload = {
            name: name,
            active_period: `[${formatDateTimeWithTZ(startDate)},${formatDateTimeWithTZ(endDate)}]`,
            dest_mpesa_phone_numbers: mpesaNumbers,
            tags: [walletPurpose]
        }
        console.log(walletPayload);
        setLoading(true)

        try {

            const walletData = await createWalletApi(walletPayload);
            console.log(walletData);

            showSnackbar('wallet created successfully', 'success');
            setActiveTab(1)

            setLoading(false);
            setOpenWalletModal(false);


        } catch (error) {
            const errorMessage = error && typeof error === "object" && "message" in error ? (error as { message: string }).message
                : "Something went wrong";
            showSnackbar(errorMessage, "error");
            setLoading(false);
            console.log(errorMessage);

        }
    }

    return (
        <div className="min-h-screen w-full flex  items-center justify-center pr-1 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950">

            <div className="min-h-screen w-[20vw] border border-red-50 flex flex-col items-center bg-white py-6">
                <h1 className="font-bold text-xl">Burn it</h1>
                <h1 >Your Wallet Manager</h1>
                <div className="h-[40vh] w-[80%] border border-gray-350 rounded-lg mt-5 p-2 flex flex-col justify-around">

                    <TabButton prop='New Wallet' onClick={() => setOpenWalletModal(true)}></TabButton>
                    <TabButton prop="Active Wallets" onClick={() => { setActiveTab(1); }}></TabButton>
                    <TabButton prop="Expired Wallets" onClick={() => setActiveTab(2)}></TabButton>
                    <TabButton prop='Logout' onClick={() => handleLogout()}></TabButton>

                </div>
                <div className="h-[20vh] w-[80%] border border-gray-350 rounded-lg mt-5 p-2 flex flex-col justify-around">

                    <TabButton prop='Manage Profile' onClick={() => setActiveTab(3)}></TabButton>
                    <TabButton prop="Contacts" onClick={() => setActiveTab(4)}></TabButton>

                </div>
            </div>

            <TabPanel value={activeTab} index={0}>
                <div className="min-h-screen w-[80vw] border border-red-50 flex flex-col items-center justify-center">
                    {loadingWallets ? (
                        <Spinner size={40} color="inherit" />
                    ) : hasActiveWallet ? (
                        
                        <div className="flex flex-col text-center justify-center items-center w-[70vw] h-[80vh] border border-red-50 rounded-lg">
                            <h1 className="text-white font-bold text-xl">Wallets loading ...</h1>
                          
                        </div>
                    ) : (
                        <div className="flex flex-col justify-around bg-white border border-red-50 rounded-lg w-[30vw] h-[40vh] p-6 shadow-lg mt-3">
                            <p>OOPS! You have no active wallet? <br /> Create one below 👇</p>
                            <Button prop="Create Wallet" onClick={() => setOpenWalletModal(true)} />
                        </div>
                    )}
                </div>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <ActiveWallets></ActiveWallets>

            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <InactiveWallets></InactiveWallets>

            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <UserProfileForm></UserProfileForm>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
                <ManageContact></ManageContact>

            </TabPanel>

            <BasicModal
                open={openWalletModal}
                setOpen={setOpenWalletModal}
                title="Create Burnit Wallet"
                description=""
            >
                <div className="flex flex-col gap-3">

                    <label className="text-gray-700">Wallet Name:</label>
                    <input
                        type="text"
                        className="border border-gray-300 rounded-lg p-2 text-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="text-gray-700 ">Purpose:</label>
                    <textarea className="text-gray-700 border border-gray-300 rounded-lg p-2 text-black h-[15vh]" placeholder="desribe your wallet purpose"
                        value={walletPurpose}
                        onChange={(e) => setWalletPurpose(e.target.value)}>

                    </textarea>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Start Date</label>
                            <input type="date" className="text-gray-700 border border-gray-300 rounded-lg p-2"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">End Date</label>
                            <input type="date" className="text-gray-700 border border-gray-300 rounded-lg p-2"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>


                    <label className="text-gray-700">Mpesa Number:</label>
                    <textarea
                        rows={3}
                        placeholder="254109248593, 254109248593"
                        className="text-black text-lg bg-transparent border border-gray-300 rounded-lg p-2 focus:outline-none resize-none"
                        value={mpesaNumbers.join(", ")}
                        onChange={(e) => {
                            const input = e.target.value.replace(/[^0-9]/g, "");

                            const chunks = [];
                            for (let i = 0; i < input.length; i += 12) {
                                chunks.push(input.substring(i, i + 12));
                            }

                            setMpesaNumbers(chunks.filter(chunk => chunk.length > 0));
                        }}
                    />

                    <button
                        disabled={loading}
                        type="button"
                        onClick={handleCreateWallet}
                        className="bg-purple-500 hover:bg-purple-400 text-white px-5 py-2 text-lg rounded-xl 
                                shadow-lg transition duration-300 cursor-pointer"
                    >
                        {loading ? <Spinner size={20} color="inherit" /> : "Confirm"}
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
        </div >
    )

}

export default Wallet