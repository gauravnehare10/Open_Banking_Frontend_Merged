import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils";
import { useParams } from "react-router-dom";
import "./PaymentStatus.css"

const PaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bank, payment_id } = useParams();

  const fetchPaymentStatus = async () => {
    try {
      const token = getCookie("access_token");
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/get-payment-status?bank=${bank}&payment_id=${payment_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaymentStatus(response.data);
    } catch (err) {
      setError("Failed to fetch payment status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  return (
    <div className="payment-status-container">
      {loading && <p className="loading">Loading payment status...</p>}
      {error && <p className="error">{error}</p>}

      {paymentStatus && (
        <div className="payment-status-card">
          <h3>Payment Status</h3>
          <p><strong>Domestic Payment ID:</strong> {paymentStatus.Data?.DomesticPaymentId}</p>
          <p><strong>Consent ID:</strong> {paymentStatus.Data?.ConsentId}</p>
          <p><strong>Status:</strong> {paymentStatus.Data?.Status}</p>
          <p><strong>Status Updated:</strong> {paymentStatus.Data?.StatusUpdateDateTime}</p>

          <h4>Initiation Details</h4>
          <p><strong>Amount:</strong> {paymentStatus.Data?.Initiation?.InstructedAmount?.Amount} {paymentStatus.Data?.Initiation?.InstructedAmount?.Currency}</p>

          <h4>Creditor Account</h4>
          <p><strong>Name:</strong> {paymentStatus.Data?.Initiation?.CreditorAccount?.Name}</p>
          <p><strong>Identification:</strong> {paymentStatus.Data?.Initiation?.CreditorAccount?.Identification}</p>

          <h4>Debtor Details</h4>
          <p><strong>Name:</strong> {paymentStatus.Data?.Debtor?.Name}</p>
          <p><strong>Identification:</strong> {paymentStatus.Data?.Debtor?.Identification}</p>

          <h4>API Link</h4>
          <p>
            <strong>Self Link:</strong>{" "}
            <a href={paymentStatus.Links?.Self} target="_blank" rel="noopener noreferrer">
              {paymentStatus.Links?.Self}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
