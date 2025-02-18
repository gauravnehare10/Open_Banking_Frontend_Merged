import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const { bank, account_id } = useParams();
  const navigate = useNavigate();

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
        const sortedTransactions = response.data.sort(
          (a, b) => new Date(b.BookingDateTime) - new Date(a.BookingDateTime)
        );
        setTransactions(sortedTransactions);
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
            <th>Booking Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Bank</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.TransactionId}>
              <td>{new Date(transaction.BookingDateTime).toLocaleString()}</td>
              <td>{transaction.Amount.Amount}</td>
              <td>{transaction.Amount.Currency}</td>
              <td>{transaction.Balance.Amount.Amount}</td>
              <td>{transaction.Status}</td>
              <td>{transaction.bank}</td>
              <td>
                <Link
                  to={`/${bank}/accounts/${account_id}/transactions/${transaction.TransactionId}`}
                  className="view-details-button"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="back-btn" onClick={ () => navigate(-1) }>Back</button>
    </div>
  );
};

export default Transactions;
