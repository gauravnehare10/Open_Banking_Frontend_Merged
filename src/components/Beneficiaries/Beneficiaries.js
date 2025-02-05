import React, { useEffect, useState } from "react";
import './Beneficiaries.css';
import { getCookie } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/beneficiaries`,
        {
            headers: {
                Authorization: `Bearer ${getCookie("access_token")}`,
            },
        }
      )
      .then((response) => {
        setBeneficiaries(response.data);
      })
      .catch((error) => console.error("Error fetching beneficiaries:", error));
  }, [bank, account_id]);

  return (
    <div className="beneficiaries-container">
      <h2>Beneficiaries List</h2>
      <table>
        <thead>
          <tr>
            <th>Beneficiary ID</th>
            <th>Account ID</th>
            <th>Type</th>
            <th>Sort Code & Account No.</th>
            <th>Beneficiary Name</th>
            <th>Bank Name</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((beneficiary) => (
            <tr key={beneficiary.BeneficiaryId}>
              <td>{beneficiary.BeneficiaryId}</td>
              <td>{beneficiary.AccountId}</td>
              <td>{beneficiary.BeneficiaryType}</td>
              <td>{beneficiary.CreditorAccount.Identification}</td>
              <td>{beneficiary.CreditorAccount.Name || "N/A"}</td>
              <td>{beneficiary.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Beneficiaries;
