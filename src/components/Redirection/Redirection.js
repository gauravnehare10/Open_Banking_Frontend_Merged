import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../utils";

const Redirect = () => {
  const { bank } = useParams();

  useEffect(() => {
    const authorizePayment = async () => {
        try {
          const accessToken = getCookie("access_token");
          console.log("Access Token:", accessToken);

          if (!accessToken) {
            console.error("User not authenticated. No access token found.");
            return;
          }

          const response = await axios.get(
            `http://localhost:8000/payment-authorize?bank=${bank}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          );

          console.log("Backend Response:", response.data);

          if (response.data) {
            window.location.href = response.data;
          } else {
            console.error("Authorization URL not received from backend.");
          }
        } catch (error) {
          console.error("Error redirecting to authorization:", error.response?.data || error.message);
        }
      };
  
      authorizePayment();
  }, [bank]);

  return <h2>Redirecting to Bank for Authorization...</h2>;
};

export default Redirect;
