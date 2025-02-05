import React, { useEffect, useState } from "react";
import "./ScheduledPayments.css";
import { getCookie } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";

const ScheduledPayments = () => {
  const [scheduledPayments, setScheduledPayments] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/scheduled-payments`, {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      })
      .then((response) => {
        setScheduledPayments(response.data);
      })
      .catch((error) => console.error("Error fetching scheduled payments:", error));
  }, [bank, account_id]);

  return (
    <div className="scheduled-payments-container">
      <h2>Scheduled Payments</h2>
      <table>
        <thead>
          <tr>
            <th>Scheduled Type</th>
            <th>Account ID</th>
            <th>Creditor Account</th>
            <th>Amount</th>
            <th>Scheduled Date</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {scheduledPayments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.ScheduledType}</td>
              <td>{payment.AccountId}</td>
              <td>
                {payment.CreditorAccount?.Name || "N/A"}<br />
                {payment.CreditorAccount?.Identification}
              </td>
              <td>
                {payment.InstructedAmount
                  ? `${payment.InstructedAmount.Amount} ${payment.InstructedAmount.Currency}`
                  : "N/A"}
              </td>
              <td>
                {payment.ScheduledPaymentDateTime
                  ? new Date(payment.ScheduledPaymentDateTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{payment.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduledPayments;
