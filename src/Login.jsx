import React, { useState } from 'react';
import './Signup.css'
import { Link , useNavigate  } from 'react-router-dom';
import { UserAuth } from './context/AuthContext'
import NavigationBar from './Components/NavigationBar';

function Signin() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const { signIn } = UserAuth();
const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await  signIn(email, password)
      navigate('/')
    } catch (e) {
    setError(e.message)
    console.log(e.message)
    }

};

      // 1. Create a state variable to store the current dimming state
  const [isDimmed, setIsDimmed] = useState(true); // you can initialize it to false or true

  // 2. Create a function that will toggle the dimming state
  const toggleDimming = () => {
    setIsDimmed(!isDimmed);
  }

  const notDimmedStyles = {
    backgroundColor: '#101010',
    transition: 'background-color 0.5s ease'
  };

  const dimmedStyles = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'background-color 0.5s ease'
  };
  
  const styles = isDimmed ? dimmedStyles : notDimmedStyles;

  const toggleStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    margin: '20px'

  };



  
    return(

      
            
      <body>

        <div style={styles}>
          
        <NavigationBar></NavigationBar>

        <button style={toggleStyles} onClick={toggleDimming} Class="M3-button">Too Bright?</button>

      <div style={{position: 'fixed', top: 0, left: 0, right: 0}}>

      

      </div>

    <div>



    <form onSubmit={handleSubmit} class="auth2">
      <div class="auth-content">
      <h1>Log in to your Account </h1>


      <h1>Don't have an account yet? <Link to ="/Signup">Sign up</Link> </h1>
     

    
            <div>
                <input placeholder="Email Address" onChange={(e) => setEmail (e.target.value)} type="email" />
                
            </div>

      
      
            <div>
              
                <input placeholder= "Password" onChange={(e) => setPassword (e.target.value)} type="password" />
                
            </div>
        <button onClick={handleSubmit} Class="M3-button">
            Sign up
        </button>
        </div>
        {error && <div className="error">Account not found. Please make sure your email and password are both correct.</div>}

      </form>




    </div>

     

    </div>
    
    </body>
    
    );
}

export default Signin;