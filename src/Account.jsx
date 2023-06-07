import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from './context/AuthContext';
import NavigationBar from './Components/NavigationBar';
import './Account.css';

function Account() {
  const navigate = useNavigate();
  const { user, logout } = UserAuth();

  const [isDimmed, setIsDimmed] = useState(true);
  const [userRole, setUserRole] = useState('');

  const toggleDimming = () => {
    setIsDimmed(!isDimmed);
  };

  const notDimmedStyles = {
    backgroundColor: '#101010',
    transition: 'background-color 0.5s ease',
  };

  const dimmedStyles = {
    backgroundColor: ' rgba(0, 0, 0, 0.5)',
    transition: 'background-color 0.5s ease',
  };

  const styles = isDimmed ? dimmedStyles : notDimmedStyles;

  const toggleStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    margin: '20px',
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out');
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    // Fetch the role from local storage
    const storedRole = localStorage.getItem('role');

    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <body>
      <div style={styles}>
        <NavigationBar />
        <button style={toggleStyles} onClick={toggleDimming} className="M3-button">
          Too Bright?
        </button>

        <div style={{ position: 'relative', top: 0, left: 0, right: 0 }}>
          {!user && (
            <div className="account-text">
              <h1>Welcome! You are currently in guest session. Please sign in to access your account.</h1>
            </div>
          )}
          {user && (
            <div>
              <h1>User Email Address: {user && user.email}</h1>
              <h2>User Role: {userRole}</h2>
              <div className="Logout">
                <button onClick={handleLogout} className="M3-button">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="Copyright"></div>
      </div>
    </body>
  );
}

export default Account;
