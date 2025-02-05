import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils";
import { Link, useParams, useSearchParams } from 'react-router-dom';
import './Accounts.css';

const Accounts = () => {
  const [accounts, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { bank } = useParams();
  const [ searchParams ] = useSearchParams();
  const accountId = searchParams.get('accountId')

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/${bank}/accounts/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${getCookie("access_token")}`,
            },
          }
        );
        setAccountData(response.data);
      } catch (err) {
        setError("Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [bank, accountId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="account-container">
      <h2>Accounts List</h2>
      {accounts.length === 0 ? (
        <p>No accounts available</p>
      ) : (
        accounts.map((account) => (
          <div key={account.AccountId} className="account-card">
            <p><strong>User ID:</strong> {account.UserId}</p>
            <p><strong>Account ID:</strong> {account.AccountId}</p>
            <p><strong>Account Type:</strong> {account.AccountType}</p>
            <p><strong>Sub Type:</strong> {account.AccountSubType}</p>
            <p><strong>Currency:</strong> {account.Currency}</p>
            <p><strong>Description:</strong> {account.Description}</p>
            <p><strong>Bank:</strong> {account.bank}</p>
            {account.Account && account.Account.length > 0 && (
              <div>
                <h3>Account Holder</h3>
                <p><strong>Name:</strong> {account.Account[0].Name}</p>
                <p><strong>Scheme:</strong> {account.Account[0].SchemeName}</p>
                <p><strong>Identification:</strong> {account.Account[0].Identification}</p>
              </div>
            )}
            {/* Navigation Links */}
            <div className="account-links">
              <Link to={`/${bank}/accounts/${account.AccountId}/transactions`}>Transactions</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/beneficiaries`}>Beneficiaries</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/direct-debits`}>Direct Debits</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/standing-orders`}>Standing Orders</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/scheduled-payments`}>Scheduled Payments</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/product`}>Products</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/statements`}>Statements</Link>
              <Link to={`/${bank}/accounts/${account.AccountId}/offers`}>Offers</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Accounts;
