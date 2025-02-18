import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../../../utils";
import "./TransactionDetails.css";

const TransactionDetails = () => {
  const { bank, account_id, TransactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/transactions/${TransactionId}`, {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      })
      .then((response) => {
        setTransaction(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transaction details:", error);
      });
  }, [bank, account_id, TransactionId]);

  if (!transaction) {
    return <p>Loading transaction details...</p>;
  }

  return (
    <div className="transaction-details-container">
      <h2>Transaction Details</h2>
      <table className="transaction-details-table">
        <tbody>
          <tr>
            <th>Transaction ID</th>
            <td>{transaction.TransactionId}</td>
          </tr>
          <tr>
            <th>User ID</th>
            <td>{transaction.UserId}</td>
          </tr>
          <tr>
            <th>Account ID</th>
            <td>{transaction.AccountId}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{transaction.Amount.Amount} {transaction.Amount.Currency}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{transaction.Balance.Amount.Amount} {transaction.Balance.Amount.Currency}</td>
          </tr>
          <tr>
            <th>Balance Type</th>
            <td>{transaction.Balance.Type}</td>
          </tr>
          <tr>
            <th>Balance Indicator</th>
            <td>{transaction.Balance.CreditDebitIndicator}</td>
          </tr>
          <tr>
            <th>Booking Date</th>
            <td>{new Date(transaction.BookingDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Transaction Type</th>
            <td>{transaction.ProprietaryBankTransactionCode.Code || "N/A"}</td>
          </tr>
          <tr>
            <th>Credit/Debit Indicator</th>
            <td>{transaction.CreditDebitIndicator}</td>
          </tr>
          <tr>
            <th>Transaction Information</th>
            <td>{transaction.TransactionInformation || "N/A"}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{transaction.Status}</td>
          </tr>
          <tr>
            <th>Bank</th>
            <td>{transaction.bank}</td>
          </tr>
        </tbody>
      </table>
      <button className="back-btn" onClick={ () => navigate(-1) }>Back</button>
    </div>
  );
};

export default TransactionDetails;
