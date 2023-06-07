import React, { useState } from 'react';
import './NavigationBar.css';
import { Link } from 'react-router-dom';
import ExpandableImage from './Image';

function NavigationBar(props) {
  const [visible, setVisible] = useState(false);

  const handleHamburgerClick = () => {
    setVisible(!visible);
  };

  return (
    <div className="navigation-container">
      <div className={`hamburger-menu ${visible ? 'open' : ''}`} onClick={handleHamburgerClick}>
        <div className="hamburger-bar"></div>
        <div className="hamburger-bar"></div>
        <div className="hamburger-bar"></div>
      </div>

      <nav className={`navigation-bar ${visible ? 'visible' : ''}`}>
        <ul>
          <Link to="/">
            <span className="Title">Home</span>
          </Link>

          <li>
            <Link to="/signup" onClick={() => setVisible(false)}>
              Sign up
            </Link>
          </li>
          <li>
            <Link to="/Posts" onClick={() => setVisible(false)}>
              Send a Package  <span className="beta-tag">BETA</span>
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setVisible(false)}>
              Log In
            </Link>
          </li>
          <li>
            <Link to="/account" onClick={() => setVisible(false)}>
              My Account
            </Link>
          </li>
      



        </ul>
      </nav>
    </div>
  );
}

export default NavigationBar;
