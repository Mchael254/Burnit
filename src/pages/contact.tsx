import React, { useEffect, useState } from "react";
import { createContact } from "../services/contacts/createContact"; 
import { useContactsStore } from "../store/useContactsStore";
import { useSnackbar } from "../hooks/snackBar";
import { getUserContacts } from "../services/contacts/getConatcts";
import { validateMpesaNumbers } from "../utils/validators";
import { modifyContact } from "../services/contacts/modifyContact";
import Button from "../components/button";
import BasicModal from "../components/modal";
import ResponseComponent from "../components/response";
import Spinner from "../components/spinner";

const ManageContact = () => {
    const { contacts, loading, error } = useContactsStore();
    const [openContactModal, setOpenContactModal] = React.useState(false);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [mpesaNumbers, setMpesaNumbers] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { open, message, severity, showSnackbar, handleClose } = useSnackbar();
    const [loadings, setLoading] = useState(false);

    useEffect(() => {
        getUserContacts('');
    }, []);

    if (loading) return <p>Loading contacts...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const handleCancel = () => {
        const validation = validateMpesaNumbers(mpesaNumbers);
        if (!validation.valid) {
            setValidationError(validation.message ?? null);
            showSnackbar(validation.message ?? '', 'warning');
            return;
        }
        setOpenContactModal(false);
        setSelectedContactId(null);
        setMpesaNumbers([]);
    };

    const handleContactSave = async () => {
        setLoading(true);

        const validation = validateMpesaNumbers(mpesaNumbers);
        if (!validation.valid) {
            setValidationError(validation.message ?? null);
            showSnackbar(validationError ?? '', 'warning');
            setLoading(false);
            return;
        }

        try {
            if (selectedContactId) {
                const selectedContact = contacts.find(c => c.id === selectedContactId);
                if (!selectedContact) {
                    showSnackbar("Selected contact not found", "error");
                    setLoading(false);
                    return;
                }

                const modifyContactPayload = {
                    name: selectedContact.name,
                    mpesa_phone_numbers: mpesaNumbers,
                };

                await modifyContact(selectedContactId, modifyContactPayload);
                showSnackbar('Contact modified', 'success');
            } else {
               
                const newContactPayload = {
                    name: "Primary Contact", 
                    mpesa_phone_numbers: mpesaNumbers,
                };

                await createContact(newContactPayload);
                showSnackbar('Contact created', 'success');
            }

            getUserContacts('');
            setOpenContactModal(false);
            setSelectedContactId(null);
            setMpesaNumbers([]);
        } catch (error) {
            console.error(error);
            showSnackbar('Unable to save contact', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-[80vw] border border-red-50 flex flex-col items-center justify-center">
            <h2 className="text-xl text-white mb-3">Manage Contacts</h2>

            {contacts.length === 0 ? (
                <div className="flex flex-col justify-around bg-white border border-red-50 rounded-lg w-[30vw] h-[40vh] p-6 shadow-lg mt-3">
                    <p>OOPS! You have no active wallet? <br /> Create one below 👇</p>
                    <Button prop="Create Wallet" onClick={() => {
                        setSelectedContactId(null);
                        setMpesaNumbers([]);
                        setOpenContactModal(true);
                    }} />
                </div>
            ) : (
                contacts.map((contact) => (
                    <div key={contact.id}
                        className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 border border-purple-600 h-[25vh] w-[45vh] rounded-lg mx-2 flex flex-col justify-around items-center mb-4 p-4 shadow-lg shadow-purple-900/50 relative">
                        <label className="text-white font-bold">My Contacts</label>
                        <ul>
                            <li className="text-grey-500">{contact.mpesa_phone_numbers.join(', ')}</li>
                        </ul>
                        <button
                            className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-lg shadow-md hover:shadow-purple-500/50 font-semibold cursor-pointer"
                            onClick={() => {
                                setSelectedContactId(contact.id);
                                setMpesaNumbers(contact.mpesa_phone_numbers);
                                setOpenContactModal(true);
                            }}>
                            Update Contacts
                        </button>
                    </div>
                ))
            )}

            <BasicModal
                open={openContactModal}
                setOpen={setOpenContactModal}
                title={selectedContactId ? "Update Contacts" : "Create New Contact"}
                description=""
            >
                <div className="flex flex-col">
                    <textarea
                        rows={3}
                        placeholder="254712345678, 254700000000"
                        className="text-black text-lg bg-transparent border border-gray-300 rounded-lg p-2 focus:outline-none resize-none"
                        value={mpesaNumbers.join(', ')}
                        onChange={(e) => {
                            const input = e.target.value;
                            const split = input.split(',').map(p => p.trim()).filter(Boolean);
                            setMpesaNumbers(split);
                            const validation = validateMpesaNumbers(split);
                            setValidationError(validation.valid ? null : validation.message ?? null);
                        }}
                    />
                 
                    <div className="flex justify-around space-x-4 mt-7">
                        <button
                            onClick={handleContactSave}
                            className="cursor-pointer px-6 py-3 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 hover:bg-green-500 text-white text-lg rounded-xl"
                        >
                            {loadings ? <Spinner size={20} color="inherit" /> : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
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
};

export default ManageContact;
