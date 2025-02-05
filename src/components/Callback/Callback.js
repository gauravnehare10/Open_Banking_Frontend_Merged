import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Callback.css'
import { getCookie } from "../../utils";

const Callback = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) 
        return;
    hasFetched.current = true;

    const fetchData = async () => {
      // Parse the hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = hashParams.get("code");
      const idToken = hashParams.get("id_token");
      const bank = localStorage.getItem("bank_name");

      const access_token = getCookie("access_token");

      if (!bank) {
        console.error("Bank name not found in localStorage");
        return;
      }

      if (code) {
        console.log("Authorization Code:", code);
        console.log("ID Token:", idToken);
        console.log("Bank_name:", bank);

        try {
          // Send the code to the backend to exchange for an access token
          const response = await axios.post(
            `http://127.0.0.1:8000/bank/exchange-token?code=${code}&bank=${bank}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          console.log("Access Token:", response.data.access_token);
          localStorage.setItem("access_token", response.data.access_token);

          navigate("/");
        } catch (error) {
          console.error("Token exchange failed:", error);
        }
      } else {
        console.error("Authorization code not found in URL");
      }
    };

    fetchData();
  }, [navigate]);

  return <div className="callback-container">Processing authorization...</div>;
};

export default Callback;