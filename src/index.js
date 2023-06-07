import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, Route, Routes  } from 'react-router-dom';
import { Posts } from './Posts';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import { AuthContextProvider } from './context/AuthContext';
import Account from './Account';



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <AuthContextProvider>
      <Routes path="/">
        <Route path="/" element={<App />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Posts" element={<Posts />} />
        <Route path="/Login" element={<Login/>}  />
        <Route path="/Account" element= {<Account/>} />
       
      </Routes>
      </AuthContextProvider>
    </Router>
    
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



