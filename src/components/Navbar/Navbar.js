import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { getCookie, deleteCookie } from "../../utils";
import useAuthStore from "../../useAuthStore";


const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("access_token");
    setIsLoggedIn(!!accessToken);
  }, [setIsLoggedIn]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    deleteCookie("access_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          AAI Financials
        </Link>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={ handleLinkClick }>Home</Link></li>
          {isLoggedIn && (
            <>
              <li><Link to="/balance" onClick={ handleLinkClick }>Balance</Link></li>
              <li><Link to="/mortgage" onClick={ handleLinkClick }>Mortgage</Link></li>
              <li><Link to="/transaction" onClick={ handleLinkClick }>Transaction</Link></li>
              <li><button className="nav-logout-btn" onClick={handleLogout}>Logout</button></li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li><Link to="/login" className="nav-login-btn" onClick={ handleLinkClick }>Login</Link></li>
              <li><Link to="/register" className="nav-register-btn" onClick={ handleLinkClick }>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
