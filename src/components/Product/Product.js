import React, { useEffect, useState } from "react";
import { getCookie } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const { bank, account_id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/${bank}/accounts/${account_id}/product`, {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching product data:", error));
  }, [bank, account_id]);

  return (
    <div className="product-container">
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Product Type</th>
            <th>Bank</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.AccountId}</td>
              <td>{product.ProductId}</td>
              <td>{product.ProductName}</td>
              <td>{product.ProductType}</td>
              <td>{product.bank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Product;
