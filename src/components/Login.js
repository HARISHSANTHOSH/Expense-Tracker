import React, { useState,useEffect } from 'react';
import { Container } from 'react-bootstrap';
import "./Login.css"
import { Link,useNavigate } from 'react-router-dom';
import getCsrfToken from './CsrfToken.js'




const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);
 

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous error messages
    setEmailError('');
    setPasswordError('');

    if (email.trim() === '') {
        setEmailError('Email is required.');
      }
    if(password.trim() === '') {
        setPasswordError('Password is required.');
      }

    // Send a POST request to your login endpoint
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      // Login successful, parse the JSON response
      const data = await response.json();
      console.log("logged")
      const accessToken = data.access_token;
      console.log('Access Token:', accessToken);

      // Set the email in sessionStorage
      const userEmail = data.email;
     

      // Store the access token in localStorage
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('accessToken', accessToken);
      navigate('/dashboard',{token:accessToken, email:userEmail})
     

      // Redirect the user or perform other actions
    } else {
      // Handle login errors and display appropriate messages
      const errorData = await response.json();
      console.log("Ds")
      console.log("Error Data:", errorData); // Log the error data
      console.log("Response Status:", response.status);
      if (errorData.msg === 'Email is not specified.') {
        setEmailError('Please enter your email.');
      } else if (errorData.msg === 'Email does not exist.') {
        setEmailError(errorData.msg);
      } else if (errorData.msg === 'Password is incorrect.') {
        setPasswordError('Incorrect password. Please try again.');
      }
    }
  };
  


  return (
    <Container className='login-container'>
    <div className='clss' style={{ paddingTop: "0px" }}>
      <h1 style={{ color: 'blue', fontSize:'2.5rem', marginTop: '-56px', marginLeft: '100px',fontWeight:'700' }}>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='clss1'>Email</label>
          <input
            className='form-control'
            style={{ marginTop: "0px" }}
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="error-message" style={{ marginTop: "10px", color: '#d9534f', }}>{emailError}</div>
        </div>
        <div>
          <label className='clss2'>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className='form-control'
              style={{ marginTop: "0px", marginBottom: '30px', paddingRight: '30px', width: '400px' }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <span
    className="password-toggle"
    onClick={togglePasswordVisibility}
    style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
  >
    {showPassword ? 'Hide' : 'Show'}
  </span>
          </div>
          <div className="error-message" style={{ marginTop: "-20px", color: '#d9534f', }}>{passwordError}</div>
        </div>
        <div style={{ width:'100px' }}>
          <button type="submit" className='btn btn-primary mt-5' style={{width:'300px',marginLeft:'50px'}} onClick={handleSubmit}>Login</button>
          <Link to="/forgot-password"  className='btn btn-link'   style={{ textDecoration: 'none', marginTop: '-180px', marginLeft: '241px', whiteSpace: 'nowrap' }} > Forgot Password?
      </Link>
        </div>
        <Link to="/registration" className='btn btn-link' style={{ marginLeft: '54px', marginTop: '0px', alignItems: 'end', whiteSpace: 'nowrap', textDecoration: 'none' }}>
  <span style={{ color: 'grey' }}>New own our platform</span> <span style={{ color: 'your_color_for_part2' }}>Create an account?</span>
</Link>

      </form>
    </div>
  </Container>
  );
};

export default Login;
