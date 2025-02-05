import React, { useEffect, useState } from "react";
import "./StandingOrders.css";
import { getCookie } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";


const StandingOrders = () => {
  const [standingOrders, setStandingOrders] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/standing-orders`,
        {
            headers: {
                Authorization: `Bearer ${getCookie("access_token")}`,
            },
        }
      )
      .then((response) => {
        setStandingOrders(response.data);
      })
      .catch((error) => console.error("Error fetching standing orders:", error));
  }, [bank, account_id]);

  return (
    <div className="standing-orders-container">
      <h2>Standing Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Creditor Account</th>
            <th>Frequency</th>
            <th>Next Payment Amount</th>
            <th>Next Payment Date</th>
            <th>First Payment Amount</th>
            <th>First Payment Date</th>
            <th>Final Payment Amount</th>
            <th>Final Payment Date</th>
            <th>Status</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {standingOrders.map((order, index) => (
            <tr key={index}>
              <td>{order.AccountId}</td>
              <td>
                {order.CreditorAccount?.Name || "N/A"}<br />
                {order.CreditorAccount?.Identification}
              </td>
              <td>{order.Frequency}</td>
              <td>
                {order.NextPaymentAmount
                  ? `${order.NextPaymentAmount.Amount} ${order.NextPaymentAmount.Currency}`
                  : "N/A"}
              </td>
              <td>
                {order.NextPaymentDateTime
                  ? new Date(order.NextPaymentDateTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {order.FirstPaymentAmount
                  ? `${order.FirstPaymentAmount.Amount} ${order.FirstPaymentAmount.Currency}`
                  : "N/A"}
              </td>
              <td>
                {order.FirstPaymentDateTime
                  ? new Date(order.FirstPaymentDateTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {order.FinalPaymentAmount
                  ? `${order.FinalPaymentAmount.Amount} ${order.FinalPaymentAmount.Currency}`
                  : "N/A"}
              </td>
              <td>
                {order.FinalPaymentDateTime
                  ? new Date(order.FinalPaymentDateTime).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{order.StandingOrderStatusCode || "N/A"}</td>
              <td>{order.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingOrders;
