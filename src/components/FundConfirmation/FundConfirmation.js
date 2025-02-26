import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FundConfirmation.css";
import { getCookie } from "../../utils";

const FundConfirmation = () => {
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const [consentStatus, setConsentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fundCheckResult, setFundCheckResult] = useState(null);

  useEffect(() => {
    if (bank) {
      checkConsent();
    }
  }, [bank]);

  const checkConsent = async () => {
    setFundCheckResult(null);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/cof/check-consent?bank=${bank}`,
        {
            headers:{
                Authorization: `Bearer ${getCookie("access_token")}`,
            },
        }
      );
      setConsentStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error checking consent");
      setConsentStatus(null);
    }
  };

  const createConsent = async () => {
    setLoading(true);
    setError("");
    localStorage.setItem("bank_name", bank);
    try {
      const response = await axios.post(
        `http://localhost:8000/cof/create-consent?bank=${bank}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      setConsentStatus({ valid: false, status: "AwaitingAuthorisation" });
      console.log(response.data)
      authorizeConsent();
    } catch (err) {
      setError(err.response?.data?.detail || "Error creating consent");
    }
    setLoading(false);
  };

  // Authorize Consent
  const authorizeConsent = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8000/cof/authorize-consent?bank=${bank}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );

      window.location.href = response.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Error authorizing consent");
    }
    setLoading(false);
  };

  const checkFundConfirmation = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `http://localhost:8000/cof/fund-confirmation?bank=${bank}`,
        {
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("access_token")}`,
          },
        }
      );
      setFundCheckResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error checking fund availability");
      setFundCheckResult(null);
    }
    setLoading(false);
  };

  return (
    <div className="fund-confirmation-container">
      <h2 className="fund-confirmation-title">Fund Confirmation Consent</h2>

      <label>Select Bank:</label>
      <select
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="fund-confirmation-select"
      >
        <option value="">Choose a bank</option>
        <option value="NatWest">NatWest</option>
        <option value="RBS">RBS</option>
      </select>
      <br />
      {consentStatus?.valid ? (
        <>
          <label>Enter Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="fund-confirmation-input"
            placeholder="Enter amount"
          />
          <button
            onClick={checkFundConfirmation}
            disabled={loading || !amount}
            className="fund-confirmation-button check-button"
          >
            {loading ? "Checking..." : "Check Fund Confirmation"}
          </button>
        </>
      ) : (
        <button
          onClick={createConsent}
          disabled={!bank || loading}
          className="fund-confirmation-button create-button"
        >
          {loading ? "Authorizing..." : "Authorize Fund Confirmation"}
        </button>
      )}

      {fundCheckResult && (
        <p className="fund-confirmation-result">
          {fundCheckResult.Data.FundsAvailable ? "✅ Funds Available" : "❌ Insufficient Funds"}
        </p>
      )}

      {error && <p className="fund-confirmation-error">{error}</p>}
    </div>
  );
};

export default FundConfirmation;
