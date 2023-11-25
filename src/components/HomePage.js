

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './SideBar';
import './HomePage.css';
import AddExpenseForm from './AddExpense';
import expenseImage from './money.png';

const HomePage = ({ navigateToAddExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  
  const navigate = useNavigate(); 

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
    document.body.style.overflow = '';
    navigate('/dashboard');
  };
  const blurStyle = isModalOpen ? { filter: 'blur(3px)' } : {};
  
  return (
    <div>
      <Sidebar className={`sidebar ${isModalOpen ? 'modal-open' : ''}`} style={blurStyle}/>
      <NavBar className={`navbar ${isModalOpen ? 'modal-open' : ''}`} style={blurStyle}/>
      <div  className={`home-page ${isModalOpen ? 'modal-open' : ''}`} style={blurStyle}>
        <h1>EXPENSE FORGE</h1>

        <div className={` innerhome ${isModalOpen ? 'modal-open' : ''}`}>
        <p style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>
  Welcome to Expense Forge! It looks like you haven't added any expenses yet.
  <br />
  Start by adding your first expense using the button below.
</p>
          <button className='home-button' 
           onClick={openModal}>
            Add
          </button>

          <p>
            Take control of your finances with our cutting-edge Expense Forge
            app. Effortlessly manage your daily expenses, gain valuable insights
            into your spending habits, and stay on top of your financial goals.
            Whether you're a budgeting pro or just starting, our intuitive
            interface and powerful features make tracking and categorizing
            expenses a breeze. Features include real-time expense recording, insightful
            visualizations, customizable spending categories, and seamless
            synchronization across devices.
          </p>
         

          <img
            src={expenseImage}
            alt="Expense Tracker Logo"
            className="logo-image" style={{width:'280px',marginTop:'-500px',height:'480px',marginLeft:'500px'}}
          />
        
        </div>
        
        
      </div>
      {isModalOpen && (
            <div className='modal-overlay'>
              <AddExpenseForm
                closeModal={closeModal}
                successMessage={successMessage}
                setSuccessMessage={setSuccessMessage}
                style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
          )}
     
    </div>
  );
};

export default HomePage;
