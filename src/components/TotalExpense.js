

import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import './TotalExpense.css';
import { getAccessToken } from './authService'; 
import getCsrfToken from './CsrfToken.js'
const TotalExpense = () => {
  const [totalExpense, setTotalExpense] = useState(0);

  const [csrfToken, setCsrfToken] = useState('');
  // console.log(csrfToken)

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

 


  const jwtToken= getAccessToken()

  const fetchTotalExpenses = useCallback(async () => {
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/totalexpense/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setTotalExpense(data.total_expense);
      } else {
        // Handle errors or return a default value
        setTotalExpense(0);
      }
    } catch (error) {
      // Handle network errors or return a default value
      console.error(error);
      setTotalExpense(0);
    }
  }, [jwtToken,csrfToken]);



  useEffect(() => {
    console.log("Total Expense component mounted");
    fetchTotalExpenses();
  }, [fetchTotalExpenses]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchTotalExpenses();
    };

    // Listen for the 'update' event (you may need to adjust based on your actual implementation)
    window.addEventListener('update', handleUpdate);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('update', handleUpdate);
    };
  }, [fetchTotalExpenses]);

  useEffect(() => {
    const handleExpenseAdded = () => {
      // Fetch the latest transactions after a new expense is added
      fetchTotalExpenses();
    };
  
    window.addEventListener('expenseAdded', handleExpenseAdded);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded);
    };
  }, [fetchTotalExpenses]);
  

  return (
    <Container className='totalexpense-container'>
      <div>
        <h2 style={{ color: 'black', fontWeight: '500' }}>EXPENSES THIS MONTH</h2>
        <p>₹{totalExpense}</p>
      </div>
    </Container>
  );
};

export default TotalExpense;
