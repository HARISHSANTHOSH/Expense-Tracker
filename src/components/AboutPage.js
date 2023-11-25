import React from 'react';
import NavBar from './NavBar';
import Sidebar from './SideBar';
import './AboutPage.css'; // You can create a separate CSS file for styling

const AboutPage = () => {
  return (
    <div>
      <Sidebar />
      <NavBar />
      <div className="about-page">
        <h1>About Us</h1>
        <div className="about-content">
          <p>
            Welcome to Expense Forge, your personal financial companion! Whether you're a seasoned budgeting pro or just starting your financial journey, Expense Forge is here to simplify the way you manage and track your expenses.
          </p>
          <p>
            <strong >Key Features:</strong>
          </p>
          <ul className="key-features-list">
            <li>Real-time expense recording for instant updates.</li>
            <li>Insightful visualizations to understand your spending patterns.</li>
            <li>Customizable spending categories tailored to your needs.</li>
            <li>Seamless synchronization across devices for on-the-go access.</li>
          </ul>
          <p>
            With Expense Forge, you can take control of your finances, make informed decisions, and work towards achieving your financial goals. Our user-friendly interface and powerful features make managing your daily expenses a breeze.
          </p>
          <p style={{fontWeight:'600',color:'black'}}>
            Ready to embark on a journey towards financial freedom? Get started with Expense Forge today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
