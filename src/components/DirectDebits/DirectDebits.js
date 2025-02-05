import React, { useEffect, useState } from "react";
import "./DirectDebits.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../utils";

const DirectDebits = () => {
  const [directDebits, setDirectDebits] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/direct-debits`,
        {
            headers: {
                Authorization: `Bearer ${getCookie("access_token")}`,
            },
        }
      )
      .then((response) => {
        setDirectDebits(response.data);
      })
      .catch((error) => console.error("Error fetching direct debits:", error));
  }, [bank, account_id]);

  return (
    <div className="direct-debits-container">
      <h2>Direct Debits</h2>
      <table>
        <thead>
          <tr>
            <th>Mandate ID</th>
            <th>Account ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Previous Payment Amount</th>
            <th>Previous Payment Date</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {directDebits.map((debit) => (
            <tr key={debit.MandateIdentification}>
              <td>{debit.MandateIdentification}</td>
              <td>{debit.AccountId}</td>
              <td>{debit.Name}</td>
              <td>{debit.DirectDebitStatusCode || "N/A"}</td>
              <td>
                {debit.PreviousPaymentAmount
                  ? `${debit.PreviousPaymentAmount.Amount} ${debit.PreviousPaymentAmount.Currency}`
                  : "N/A"}
              </td>
              <td>
                {debit.PreviousPaymentDateTime
                  ? new Date(debit.PreviousPaymentDateTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{debit.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DirectDebits;
