import React, { useState,useEffect } from 'react';
import getCsrfToken from './CsrfToken.js'
import { Link } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import './ForgotPassword.css'
import { ToastContainer, toast } from 'react-toastify';
const ForgotPassword = () => {
    console.log('ForgotPassword component rendered');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);
  const handleForgotPassword = async () => {
    console.log("ee",email)
    try {
      const response = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ email }),
      });
      console.log(email)

      const data = await response.json();

      if (response.ok) {
        toast.success('Email sent successfully!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
   
    <div  className="forgot-password-container">
       <ToastContainer className="custom-toast" />
      
      <h2 style={{marginTop:'90px',fontWeight:'700',fontSize:'27px'}}>Forgot Password</h2>
      <div  className="inputcontainer">
        <p style={{marginTop:'-110px',color:'rgb(87, 84, 84)',fontWeight:'400'}}>Enter your email and we'll send you a link to reset your password.</p>
        <input style={{width:'340px',marginLeft:'21px',marginTop:'15px'}} className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email@address.com' />
   

      </div>
      <Link to="/login" className='back-to-login' style={{ marginLeft: '54px', marginTop: '0px', alignItems: 'end', whiteSpace: 'nowrap', textDecoration: 'none' }}>
  <span style={{ color: 'grey',marginTop:'310px' }}>  <FaAngleLeft style={{fontSize:'28px'}} />   Back to Login</span>
</Link>
      <button className="submit-button" onClick={handleForgotPassword}>Submit</button>
      <p className="message" >{message}</p>
    </div>
    
  );
};

export default ForgotPassword;
