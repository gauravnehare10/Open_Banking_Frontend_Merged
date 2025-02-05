import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/transactions`,
        {
            headers: {
                Authorization: `Bearer ${getCookie("access_token")}`,
            },
        }
      )
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, [bank, account_id]);

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Account ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Balance</th>
            <th>Booking Date</th>
            <th>Status</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.TransactionId}>
              <td>{transaction.TransactionId}</td>
              <td>{transaction.AccountId}</td>
              <td>{transaction.Amount.Amount}</td>
              <td>{transaction.Amount.Currency}</td>
              <td>{transaction.Balance.Amount.Amount}</td>
              <td>{new Date(transaction.BookingDateTime).toLocaleString()}</td>
              <td>{transaction.Status}</td>
              <td>{transaction.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
