import React, { useState } from "react";
import axios from 'axios';
import "./Register.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../useAuthStore";

const Register = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const { setIsLoggedIn } = useAuthStore();

    const navigate = useNavigate();

    const storeTokens = (response) => {
        const { access_token, refresh_token, expires_in, token_type } = response;
    
        // Set cookies with max-age (expiry time in seconds)
        document.cookie = `access_token=${access_token}; max-age=${expires_in}; secure; samesite=strict`;
        document.cookie = `refresh_token=${refresh_token}; max-age=86400; secure; samesite=strict`; // 1 day expiry
        document.cookie = `token_type=${token_type}; max-age=86400; secure; samesite=strict`;
    
        console.log("Tokens stored in cookies with expiry in seconds.");
      };

    const handleRegister = (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
        setError('Please fill in both fields');
        return;
        }

        setError('');
        setSuccess('');
        const endpoint = "http://127.0.0.1:8000/register"
        axios.post(endpoint, {
            username: username.toLowerCase(),
            name: name,
            email: email,
            contactnumber: contactnumber,
            password: password,
        },)
        .then((response) => {
            console.log('Register successful:', response.data);
            storeTokens(response.data);
            setIsLoggedIn(true);
            setSuccess('Logged in Successfully.');
            navigate('/')
        })
        .catch((error) => {
            console.log('Register Error', error);
            setError('Invalid username or password. Please try again.');
        })
    }

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1 className="brand-title">AAI Financials</h1>
          <p className="tagline">
            Where we prioritize your financial journey with trust, transparency, and expertise
          </p>
          <div className="image-placeholder"></div>
        </div>
        <div className="register-right">
          <h2 className="welcome-text">Welcome</h2>
          <p className="register-subtext">register here</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form className="register-form" onSubmit={ handleRegister }>
            <div className="input-group">
              <input type="text" placeholder="Username" value={username} onChange={ (e) => setUsername(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Full Name" value={name} onChange={ (e) => setName(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="number" placeholder="Contact Number" value={contactnumber} onChange={ (e) => setContactNumber(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value)} required />
            </div>
            <p className="forgot-password">Forgot your password?</p>
            <button type="submit" className="register-btn">Register</button>
          </form>
          <p className="or-text">OR</p>
          <div className="social-register">
            <button className="social-btn google">G</button>
            <button className="social-btn facebook">F</button>
            <button className="social-btn apple"></button>
          </div>
          <p className="register-text">
            Alreaddy have an account? <span className="login-link">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
