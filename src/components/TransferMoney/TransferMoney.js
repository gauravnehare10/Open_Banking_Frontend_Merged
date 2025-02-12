import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils";
import "./TransferMoney.css";

export default function TransferMoney() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const bank = queryParams.get("bank");

    const navigate = useNavigate();

    const [bankAccounts, setBankAccounts] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

    const [amount, setAmount] = useState("");
    const [schemeName, setSchemeName] = useState("");
    const [identification, setIdentification] = useState("");
    const [name, setName] = useState("");
    const [secIdentif, setSecIdentif] = useState("");

    useEffect(() => {
        const fetchAllBeneficiaries = async () => {
            try {
                const accountsResponse = await axios.get(
                    `http://127.0.0.1:8000/bank-accounts/${bank}`,
                    { headers: { Authorization: `Bearer ${getCookie("access_token")}` } }
                );
    
                setBankAccounts(accountsResponse.data);
    
                let allBeneficiaries = [];
                await Promise.all(
                    accountsResponse.data.map(async (account) => {
                        try {
                            const beneficiariesResponse = await axios.get(
                                `http://127.0.0.1:8000/${bank}/accounts/${account.AccountId}/beneficiaries`,
                                { headers: { Authorization: `Bearer ${getCookie("access_token")}` } }
                            );
    
                            allBeneficiaries = [...allBeneficiaries, ...beneficiariesResponse.data];
                        } catch (error) {
                            console.error(`Error fetching beneficiaries for account ${account.AccountId}:`, error);
                        }
                    })
                );
    
                setBeneficiaries(allBeneficiaries);
            } catch (error) {
                console.error("Error fetching bank accounts:", error);
                alert("Failed to load bank accounts.");
            }
        };
    
        if (bank) {
            fetchAllBeneficiaries();
        }
    }, [bank]);

    // Handle selection of a beneficiary
    const handleSelectBeneficiary = (beneficiaryId) => {
        setSelectedBeneficiary(beneficiaryId);
        const selected = beneficiaries.find((b) => b.BeneficiaryId === beneficiaryId);
        if (selected) {
            setSchemeName(selected.CreditorAccount?.SchemeName || "");
            setIdentification(selected.CreditorAccount?.Identification || "");
            setName(selected.CreditorAccount?.Name || "");
            setSecIdentif(selected.CreditorAgent?.Identification || "");
        }
    };

    // Handle transfer request
    const handleTransfer = async () => {
        if (!amount || !selectedBeneficiary) {
            alert("Please enter the amount and creditor's details or select a beneficiary.");
            return;
        }

        const accountDetails = {
            amount,
            schemeName,
            identification,
            name,
            secIdentif,
        };

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/create-payment-consent/?bank=${bank}`,
                accountDetails,
                {
                    headers: { Authorization: `Bearer ${getCookie("access_token")}` },
                }
            );

            if (response.status === 200) {
                const consentId = response.data;
                navigate(`/redirect/${bank}/${consentId}`);
            } else {
                alert("Failed to create consent. Please try again.");
            }
        } catch (error) {
            console.error("Error during transfer:", error);
            alert("Something went wrong. Please check your details and try again.");
        }
    };

    return (
        <div className="transfer-money-container">
            <h3>Select Beneficiary</h3>
            <select className="transfer-money-input" value={selectedBeneficiary} onChange={(e) => handleSelectBeneficiary(e.target.value)}>
                <option value="">-- Select a Beneficiary --</option>
                {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary.BeneficiaryId} value={beneficiary.BeneficiaryId}>
                        {beneficiary.CreditorAccount?.Name} ({beneficiary.CreditorAccount?.Identification})
                    </option>
                ))}
            </select>

            <h3>Creditor's Account Details</h3>
            <table className="transfer-money-table">
                <tbody>
                    <tr>
                        <th>Amount</th>
                        <td><input className="transfer-money-input" type="number" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Scheme Name</th>
                        <td><input className="transfer-money-input" type="text" placeholder="Scheme Name" required value={schemeName} onChange={(e)=>setSchemeName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Identification</th>
                        <td><input className="transfer-money-input" type="text" placeholder="Identification" required value={identification} onChange={(e)=>setIdentification(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td><input className="transfer-money-input" type="text" placeholder="Name" required value={name} onChange={(e)=>setName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Secondary Identification</th>
                        <td><input className="transfer-money-input" type="text" placeholder="Secondary Identification" value={secIdentif} onChange={(e)=>setSecIdentif(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <button className="transfer-money-btn" onClick={handleTransfer}>Transfer</button>
        </div>
    );
}
