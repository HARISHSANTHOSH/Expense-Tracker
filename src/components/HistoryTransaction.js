
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import NavBar from './NavBar';
import Sidebar from './SideBar';
import getCsrfToken from './CsrfToken.js'
import 'react-toastify/dist/ReactToastify.css';
import EditTransaction from './EditTransaction';
import './HistortTable.css';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAccessToken } from './authService';
function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const jwtToken = localStorage.getItem('accessToken');
  const jwtToken= getAccessToken()
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
    const fetchData = async () => {
      try {
        const formattedStartDate = startDate.split('/').reverse().join('-');
        const formattedEndDate = endDate.split('/').reverse().join('-');
        const params = new URLSearchParams({
          page: currentPage,
          search_term: searchTerm,
          category_filter: categoryFilter,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        });

        const response = await fetch(`http://localhost:8000/api/historytransaction/?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
            'X-CSRFToken': csrfToken,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [jwtToken,csrfToken, currentPage, searchTerm, categoryFilter, startDate, endDate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user-categories/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, [jwtToken]);

  const handleEdit = (transaction) => {
    if (transaction && transaction.id) {
      setSelectedTransaction(transaction);
    } else {
      console.error('Transaction or id is undefined');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/edit-transaction/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        toast.success('Transaction deleted successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const updatedResponse = await fetch(`http://localhost:8000/api/historytransaction/?page=${currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setTransactions(data);
          window.dispatchEvent(new Event('update'));
          setSelectedTransaction(null);
        } else {
          console.error('Error fetching updated data after deletion');
        }
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleUpdate = async (updatedTransaction) => {
    try {
      const response = await fetch(`http://localhost:8000/api/edit-transaction/${updatedTransaction.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (response.ok) {
        toast.success('Transaction updated successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const updatedResponse = await fetch(`http://localhost:8000/api/historytransaction/?page=${currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setTransactions(data);
          window.dispatchEvent(new Event('update'));
          setSelectedTransaction(null);
        } else {
          console.error('Error fetching updated data after update');
        }
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="App">
      <NavBar />
      <Sidebar />
      <ToastContainer />

      <div className="filter-container">
        <input
          className='styled-inputH'
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search Here'
        />
        <FaSearch className="search-icon" />

        <div className='michel' style={{ marginTop: '-30px' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='styled-inputC'
          >
            <option className='tt' value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <label className='e' style={{ marginLeft: '680px', marginTop: '-90px' }}>Start Date: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginTop: '-110px' }}
          className='styled-inputD'
        />

        <label style={{marginLeft:''}} className='r' >End Date: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='styled-inputD'
        />
      </div>

      {searchTerm !== '' && transactions.length === 0 ? (
        <div className="no-data-message">
          No data found for the specified criteria.
        </div>
      ) : (
        <div>
          <table className="history-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.name}</td>
                  <td>{transaction.amount}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <button onClick={() => handleEdit(transaction)}>Edit</button>
                    <button style={{backgroundColor:'rgb(209, 77, 77)'}} onClick={() => handleDelete(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedTransaction !== null && (
            <EditTransaction
              id={selectedTransaction.id}
              onCancel={() => setSelectedTransaction(null)}
              onUpdate={(updatedTransaction) => handleUpdate(updatedTransaction)}
            />
          )}

          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
              style={{ marginRight: '10px' }}
            >
              <FaChevronLeft />
            </button>
            <span className="page-icon">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="pagination-button"
              style={{ marginLeft: '10px' }}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;


