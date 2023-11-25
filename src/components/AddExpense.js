
import React, { useState,useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import './AddExpense.css';
import getCsrfToken from './CsrfToken.js'
import { getAccessToken } from './authService'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
function AddExpenseForm({ closeModal: closeParentModal }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(getFormattedDateTime(new Date()));
  const [confirmation, setConfirmation] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  console.log(modalOpen)
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  function getFormattedDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
   
    return `${year}-${month}-${day}`;
  }

  

  
  const closeModalLocal = () => {
    console.log('leo')
    setModalOpen(false);
    closeParentModal(); // Call the provided closeModal function
  };

  const handleSubmit = async (e) => {
    // const jwtToken = localStorage.getItem('accessToken');
    const jwtToken=getAccessToken()
    const decodedToken = jwt_decode(jwtToken);
    const userId = decodedToken.user_id;

    e.preventDefault();
    setFormSubmitted(true);
    setConfirmation('');
    setDescriptionError('');
    setCategoryError('');
    


// Validate name (description) input
if (!name.trim()) {
  // Show red border without an error message if the field is empty
  setDescriptionError('');
} else if (!/^[a-zA-Z\s]+$/.test(name.trim())){
  // Show red border with an error message for numbers
  setDescriptionError('Letters only, please');
  return;
}

// Validate category input
if (!category.trim()) {
  // Show red border without an error message if the field is empty
  setCategoryError('');
} else if (!/^[a-zA-Z\s]+$/.test(category.trim())) {
  // Show red border with an error message for numbers
  setCategoryError('Invalid Category');
  return;
}

// Show red border if form is submitted without any input
if (formSubmitted && (!name.trim() || !category.trim())) {
  setDescriptionError('');
  setCategoryError('');
  return;
}



// Validate amount input
if (!isNaN(amount) && !/^\d+(\.\d{1,2})?$/.test(amount)) {
  setConfirmation('');
  return;
}

    const newExpense = {
      name,
      amount: parseFloat(amount).toFixed(2),
      category,
      date: date,
      user: userId,
    };

    try {
      const response = await fetch('http://localhost:8000/api/expense/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(newExpense),
      });

      if (response.status === 201) {
        window.dispatchEvent(new Event('expenseAdded'));
        toast.success('Expense Added Successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
       
        
        setName('');
        setAmount('');
        setCategory('');
        setDate(getFormattedDateTime(new Date()));
        setFormSubmitted(false);
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.amount) {
          setConfirmation(data.amount[0]);
        } else {
          setConfirmation('Expense could not be added.');
        }
      } else {
        setConfirmation('An error occurred while adding the expense.');
      }
    } catch (error) {
      console.error('An error occurred while adding the expense:', error);
    }
  };

  return (
   <div>
   
     <div className='form-container'>
     <ToastContainer className="custom-toast-container" />
     
      
      <div className="input-container">
        <h2>New Expense</h2>
        <hr></hr>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container2">
            <label className="description">Description</label>
            <input
            className={`styled-input ${formSubmitted && !name ? 'error-border' : ''}`}
              id="nameInput"
              type="text"
              placeholder="Name/Description"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginLeft: '13px', marginBottom: '29px', width: '300px' }}
              required
              
            /><br></br>
            {descriptionError && <div className="error-messages">{descriptionError}</div>}
            <label className="amount">Amount</label>
            <input
              className={`styled-input ${formSubmitted && !amount ? 'error-border' : ''}`}
              id="amountInput"
              type="text"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ marginLeft: '19px', marginBottom: '29px', width: '140px' }}
              required
            /><br></br>
               {confirmation && (
             <div className={`confirmations-message ${formSubmitted && (!amount || (!isNaN(amount) && !/^\d+(\.\d{1,2})?$/.test(amount))) ? 'error-text' : ''}`} style={{ marginTop: '-28px', marginBottom: '15px', }}>
         {confirmation}
        </div>
            )}
            
          
            <label className="date">Date</label>
            <input
              className="styled-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ marginLeft: '18px', marginBottom: '29px', width: '200px' }}
              required
            /><br></br>
            <label className="category">Category</label>
            <input
               className={`styled-input ${formSubmitted && !category ? 'error-border' : ''}`}
      

              id="categoryInput"
              type="text"
              placeholder="Category"
              value={category}
              style={{ marginLeft: '16px', marginBottom: '29px', width: '270px' }}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
         <br></br>
         {categoryError && <div className="error-messages">{categoryError}</div>}
              
          </div>
          <button className="styled-button" type="submit" >
            Add Expense
          </button>
         
          
            <span className="close" onClick={closeModalLocal}>&times;</span>
        </form>
      </div>

    </div>
   </div>
  );
}

export default AddExpenseForm;







