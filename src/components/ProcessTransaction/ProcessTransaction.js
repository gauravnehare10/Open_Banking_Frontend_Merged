import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";

const ProcessTransaction = () => {
    const [message, setMessage] = useState(null);
    const { bank } = useParams();
    const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const token = getCookie("access_token");
      if (!token) {
        alert("User not authenticated");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/create-payment-order?bank=${bank}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response_data = response.data ;
      setMessage("Transaction successfull!")
      navigate(`/payment-status/${bank}/${response_data.Data.DomesticPaymentId}`)
    } catch (err) {
      setMessage("Transaction Failed!");
    }
  };

  useEffect(()=>{
    handlePayment();
  }, [])

  return (
    <div>
      { message? (
        <>
            <h2>{message}</h2>
        </>
      ):(
        <>
            <h2 style={{marginTop: '80px', fontSize: '15px'}}>Processing transaction...</h2>
        </>
      )
      }
    </div>
  );
};

export default ProcessTransaction;
