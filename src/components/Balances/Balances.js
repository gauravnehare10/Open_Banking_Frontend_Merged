import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getCookie } from "../../utils";

const Balances = () => {
  const { bank, account_id } = useParams();
  
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/${bank}/accounts/${account_id}/balances`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("access_token")}`,
            },
          }
        );
        setBalances(response.data);
      } catch (err) {
        setError("Failed to fetch balances");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [bank, account_id]);

  if (loading) return <p>Loading balances...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Account Balances</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Account ID</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Credit/Debit</th>
            <th>DateTime</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((balance, index) => (
            <tr key={index}>
              <td>{balance.Type}</td>
              <td>{balance.AccountId}</td>
              <td>{balance.Amount.Amount}</td>
              <td>{balance.Amount.Currency}</td>
              <td>{balance.CreditDebitIndicator}</td>
              <td>{new Date(balance.DateTime).toLocaleString()}</td>
              <td>{balance.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Balances;
