import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { getCookie } from "../../utils";
import useAuthStore from "../../useAuthStore";

const Home = () => {
  const [authorizedBanks, setAuthorizedBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountDetails, setAccountDetails] = useState([]);
  const [balanceAndTransactions, setBalanceAndTransactions] = useState(null);

  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      fetchAuthorizedBanks(accessToken);
    }
  }, []);

  const fetchAuthorizedBanks = async (accessToken) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/authorized-banks", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.length > 0) {
        setAuthorizedBanks(response.data);
        setSelectedBank(response.data[0]);
        fetchAccountDetails(accessToken, response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching authorized banks:", error);
      navigate("/bank_auth")
    }
  };

  // Fetch account details for the selected bank
  const fetchAccountDetails = async (accessToken, bank) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/bank-accounts/${bank}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.length > 0) {
        setAccountDetails(response.data);
        const firstAccountId = response.data[0].AccountId;
        fetchBalanceAndTransactions(accessToken, bank, firstAccountId);
      }
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  // Fetch balance and the latest transactions for a given bank and account
  const fetchBalanceAndTransactions = async (accessToken, bank, accountId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/balance-and-transaction/${bank}/${accountId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setBalanceAndTransactions(response.data);
    } catch (error) {
      console.error("Error fetching balance and transactions:", error);
    }
  };

  // Handle user selecting a new bank
  const handleBankSelection = (event) => {
    const newBank = event.target.value;
    setSelectedBank(newBank);
    const accessToken = getCookie("access_token");
    if (accessToken) {
      fetchAccountDetails(accessToken, newBank);
    }
  };

  const handleAccountClick = (accountId) => {
    navigate(`/account/${selectedBank}?accountId=${accountId}`);
  };

  const handleTransferClick = () => {
    navigate(`/transfer-money?bank=${selectedBank}`)
  }


  if (!isLoggedIn) {
    return (
      <div className="app-info">
        <h1>Welcome to AAI Financials</h1>
        <p>Your trusted platform for managing your finances.</p>
        <div className="auth-buttons">
          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/register" className="btn">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h2>Welcome Back!</h2>

      {/* Bank Selection Dropdown */}
      <div className="bank-selection">
        <label htmlFor="bank-dropdown">Select a Bank: </label>
        <select id="bank-dropdown" className="bank-dropdown" value={selectedBank} onChange={handleBankSelection}>
          {authorizedBanks.map((bank, index) => (
            <option key={index} value={bank}>
              {bank}
            </option>
          ))}
        </select>
        <button className="transfer-button" style={{marginLeft: "5px"}} onClick={ handleTransferClick }>Transfer Money</button>
      </div>

      {accountDetails.length > 0 ? (
        <div className="dashboard">
          {accountDetails.map((account, index) => (
            <div
              key={index}
              className="account-card"
              onClick={() => handleAccountClick(account.AccountId)}
              style={{ cursor: "pointer" }}
            >
              <h3>{account.Nickname}</h3>
              <p>
                <strong>Account Number:</strong>{" "}
                {account.Account && account.Account[0] && account.Account[0].Identification}
              </p>
              <p>
                <strong>Type:</strong> {account.AccountType}
              </p>
              <p>
                <strong>SubType:</strong> {account.AccountSubType}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No account details available for the selected bank.</p>
      )}

      {balanceAndTransactions && (
        <div className="balance-transaction">
          <h3>Latest Balance</h3>
          {balanceAndTransactions.balance?.Amount ? (
            <p>
              <strong>Balance:</strong> £
              {balanceAndTransactions.balance.Amount.Amount}{" "}
              {balanceAndTransactions.balance.Amount.Currency}
            </p>
          ) : (
            <p>Balance information not available.</p>
          )}

          <h3>Latest Transactions</h3>
          {balanceAndTransactions.transactions &&
          balanceAndTransactions.transactions.length > 0 ? (
            <ul>
              {balanceAndTransactions.transactions.map((txn, index) => (
                <li key={index}>
                  {txn.TransactionInformation} - £{txn.Amount.Amount}{" "}
                  {txn.Amount.Currency}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
