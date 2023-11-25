


import React, { useState, useEffect } from 'react';
import './EditTransaction.css';
import { getAccessToken } from './authService'; 
import getCsrfToken from './CsrfToken.js'

function EditTransaction({ id, onCancel, onUpdate }) {
  const [editedTransaction, setEditedTransaction] = useState({
    name: '',
    amount: 0,
    category: '',
    date: '',
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
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/edit-transaction/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            // Include your authorization token if needed
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEditedTransaction({
            ...data,
            date: data.date || new Date().toISOString().slice(0, 10), // Set default date if empty
          });
        } else {
          console.error('Failed to fetch transaction');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchTransaction();
  }, [id,csrfToken]);

  const handleUpdate = () => {
    // const jwtToken = localStorage.getItem('accessToken');
    const jwtToken=getAccessToken()
    const formattedDate = editedTransaction.date
    ? new Date(editedTransaction.date).toISOString().slice(0, 10)
    : '';

    fetch(`http://localhost:8000/api/edit-transaction/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({
        ...editedTransaction,
        // Convert the date to ISO format before sending
        date: formattedDate
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Notify the parent component about the update
          onUpdate(editedTransaction);
        } else {
          console.error('Update failed');
        }
      })
      .catch((error) => {
        console.error('Update error:', error);
      });
  };

  return (
    <div className="edit-transaction-container-custom">
      <div className="edit-transaction-form-custom">
        <h2 style={{marginBottom:'0px'}}>Edit Transaction</h2>
        <hr style={{paddingBottom:'60px',width:'547px',marginLeft:'-20px'}}></hr>
        <form>
          <div className="form-group">
            <label htmlFor="nameInput" className='descriptione' style={{marginRight:'20px'}}>Description</label>
            <input
              type="text"
              id="nameInput"
              value={editedTransaction.name}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, name: e.target.value })}
              className="styled-input"
              style={{marginRight:'50px',width:'280px'}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amountInput" className='amounte' style={{marginLeft:'55px'}}>Amount</label>
            <input
              type="number"
              id="amountInput"
              value={editedTransaction.amount}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: e.target.value })}
              className="styled-input"
              style={{marginRight:'212px',width:'140px'}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateInput" className='datee' style={{marginLeft:'6px'}}>Date</label>
            <input
              type="date"
              id="dateInput"
              value={editedTransaction.date}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, date: e.target.value })}
              className="styled-input"
              style={{marginRight:'80px',width:'200px'}}
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryInput" className='categorye' style={{marginLeft:'40px'}}>Category</label>
            <input
              type="text"
              id="categoryInput"
              value={editedTransaction.category}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, category: e.target.value })}
              className="styled-input"
              style={{marginRight:'80px',width:'270px'}}
            />
          </div>
          
          <div className="button-container">
            <button type="button" onClick={handleUpdate} className="styled-button-save">
              Save
            </button>
            <button type="button" onClick={onCancel} className="styled-button-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransaction;
