import React, { useEffect, useState, useCallback } from 'react';
import BarGraph from './BarGraph'; // Import your BarGraph component or the appropriate graph component
import { getAccessToken } from './authService';
import getCsrfToken from './CsrfToken.js'

const MonthlyExpenseGraph = () => {
  const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
  const jwtToken = getAccessToken();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);
  

  const fetchMonthlyExpenseData = useCallback(async () => {
    try {
      // Set the year dynamically, replace with your logic if needed
      const currentYear = new Date().getFullYear();
      
      const apiUrl = `http://localhost:8000/api/reports/?report_type=monthly_total_by_month&year=${currentYear}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMonthlyExpenseData(data.bar_graph_data);
    } catch (error) {
      console.error('Error fetching monthly expense data:', error);
    }
  }, [jwtToken,csrfToken]);

  useEffect(() => {
    fetchMonthlyExpenseData();
  }, [fetchMonthlyExpenseData]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', margin: '20px 0' }}>Monthly Expense Graph</h2>
      <BarGraph data={monthlyExpenseData} type="monthly" />
    </div>
  );
};

export default MonthlyExpenseGraph;


