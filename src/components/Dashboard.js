
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import TotalExpense from './TotalExpense';
import Sidebar from './SideBar';
import AddExpenseForm from './AddExpense';
import './Dashboard.css';
import ExpensesByCategory from './ExpenseChart';
import RecentTransaction from './RecentTranscation';
import { getAccessToken } from './authService';
import getCsrfToken from './CsrfToken.js'

const Dashboard = () => {
  // const accessToken = localStorage.getItem('accessToken');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const AccessToken=getAccessToken()
  const [hasExpenses, setHasExpenses] = useState(false);
  console.log(hasExpenses);
  const [modalPosition, setModalPosition] = useState({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  });
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const checkUserExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/check-expenses/', {
          method: 'GET',
          headers: {
            // 'Authorization': `Bearer ${accessToken}`
            'Authorization': `Bearer ${AccessToken}`,
            'X-CSRFToken': csrfToken,
         
          },
        });

        const data = await response.json();
        setHasExpenses(data.hasExpenses);

        // Redirect based on whether the user has expenses
        if (data.hasExpenses) {
          navigate('/dashboard');
        } else {
          navigate('/homepage');
        }
      } catch (error) {
        console.error('Error checking user expenses:', error);
        // Handle error as needed
      }
    };

    checkUserExpenses();
  }, [AccessToken, navigate,csrfToken]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
    document.body.style.overflow = '';
  };
  const changeModalPosition = () => {
    // Update the modal position based on your desired logic
    const newPosition = {
      position: 'fixed',
      top: '10%', // Change this value based on your desired top position
      left: '10%', // Change this value based on your desired left position
      transform: 'translate(0%, 0%)',
    };

    setModalPosition(newPosition);
  }

  return (
    <div className={`dashboard-container ${isModalOpen ? 'modal-open' : ''}`}>
      <NavBar className={`navbar ${isModalOpen ? 'modal-open' : ''}`} />
      <Sidebar className={`sidebar ${isModalOpen ? 'modal-open' : ''}`} />

      <div className='main-content'>
        <TotalExpense />
        <ExpensesByCategory />
        <RecentTransaction />
        
        <button className='addd-button' onClick={() => {openModal(); changeModalPosition();}}>
          <p style={{ color: 'black', fontSize: '23px', fontWeight: '400' }}>Quickly Add Expense</p>
          <h2 style={{ fontSize: '20px', border: '1px solid rgb(62, 114, 168)', padding: '10px', backgroundColor: 'rgb(62, 114, 168)', width: '100px', marginLeft: '120px', borderRadius: '50px', color: 'white'}}>Add</h2>
        </button>

        {/* AddExpenseForm component */}
      
      </div>
      {isModalOpen && (
          <div className='modal-overlay'>
            <AddExpenseForm
              closeModal={closeModal}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              style={modalPosition}
            />
          </div>
        )}
   
    </div>
  );
};

export default Dashboard;
