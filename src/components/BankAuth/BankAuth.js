import React, { useState } from "react";
import axios from "axios";
import "./BankAuth.css";
import { getCookie } from "../../utils";

const BankAuth = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [loading, setLoading] = useState(false);

  const banks = ["NatWest", "RBS"];

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedBank) {
      alert("Please select a bank.");
      return;
    }
    localStorage.setItem('bank_name', selectedBank);
    const access_token = getCookie("access_token");
    try{
    const response = await axios.post(
      `http://localhost:8000/bank/create-consent/?bank=${selectedBank}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        }
    );
  
    if (response.status === 200) {
        const response = await axios.post(
          `http://localhost:8000/bank/submit-consent/?bank=${selectedBank}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${access_token}`, 
            },
          }
        );

        if (response.status === 200) {
          window.location.href = response.data.auth_url;
        }
    }
	} catch (error) {
        console.error("Error creating consent:", error);
        alert("Failed to request consent from bank.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="permission-form">
      <h2>Select Bank</h2>

      {/* Bank Selection Dropdown */}
      <label htmlFor="bank">Select Bank:</label>
      <select id="bank" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
        <option value="">-- Select a Bank --</option>
        {banks.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </select>

      {loading && <p>Redirecting to your bank website...</p>}

      <button type="submit" onClick={ handleSubmit }>Add Bank</button>
    </div>
  );
};

export default BankAuth;
