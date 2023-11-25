import React, { useState,useEffect } from 'react';
import { Container,Modal,Button } from 'react-bootstrap';
import "./Registration.css"
import getCsrfToken from './CsrfToken.js'
import { useNavigate } from 'react-router-dom';
export const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [backendError, setBackendError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  

  const handleRegistration = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setBackendError(null);
    

    if (username.trim() === '') {
      setUsernameError('Username is required.');
    }

    if (email.trim() === '') {
      setEmailError('Email is required.');
    } else if (!/[^@]+@[^@]+\.[^@]+/.test(email)) {
      setEmailError('Invalid email format. Please enter a valid email.');
    }

    if (password.length === 0) {
      setPasswordError('Password is required.');
      return; // Stop further processing
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one capital letter.');
    } else if (!/\d/.test(password)) {
      setPasswordError('Password must contain at least one number.');
    } else if (!/[@#$!%*?&]/.test(password)) {
      setPasswordError('Password must contain at least one special character.');
    }

    // Continue with registration if no errors
    if (usernameError === '' && emailError === '' && passwordError === '') {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 400) {
        const data = await response.json();
        // const token = data.token;
        // console.log('Received Token:', token);
        // localStorage.setItem('VerifyToken', token);
        // console.log("s")
        // setPasswordError(data.error)
        if (data.error.includes('Email is already in use')) {
        setEmailError(data.error);
        console.log('Specific Email Error:', data.error);
      }else if (data.error){

        setPasswordError(data.error)
      }
      
      
      else {
        // Set the general backend error
        setBackendError('Network error: Please check your internet connection and try again.');
        // console.log('General Backend Error:', data.error);
      }
       
       
        
      } else {
        setShowSuccessModal(true)
        // Registration successful logic
      }
    }
  };
  const redirectToLogin = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <Container className="registration-container">
    
      
      <div className='cls' style={{ paddingTop: "80px" }}>
      <h1 style={{color:'blue',fontSize:'2.5rem',marginTop:'-20px',marginLeft:'66px',fontWeight:'700'}}>Sign Up</h1>
     
      <form onSubmit={handleRegistration}>
          <div className='kk'>
            <label className="cls1" htmlFor="username">
              Username
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /><br></br>
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>
          <div>
            <label className="cls2" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /><br></br>
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          <div>
            <label className="cls3" htmlFor="password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-control"
                type={showPassword ? "text" : "password"} // Toggle input type based on visibility state
                placeholder="Password"
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
              {passwordError && <div className="error-message" style={{paddingTop:'25px'}}>{passwordError}</div>}
            </div>
            
          </div>
          {backendError && <div className="error-message">{backendError}</div>}
          <button className="btn btn-primary mt-5" style={{marginTop:'60px'}} onClick={handleRegistration}>
            Sign up
          </button>
        </form>
      </div>
       {/* Success Modal */}
       <Modal className='small-modal' show={showSuccessModal} onHide={redirectToLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your registration was successful. You can now proceed to login.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={redirectToLogin}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
         
    </Container>
  );
};

export default Registration;
