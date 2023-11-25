




import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditTransaction from './EditTransaction';
import './RecentTransaction.css';
import getCsrfToken from './CsrfToken.js'
import { getAccessToken } from './authService'; 
function RecentTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  console.log(csrfToken)
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  // const jwtToken = localStorage.getItem('accessToken');
  const jwtToken= getAccessToken()

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/fetchlatest/', {
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
      const sortedTransactions = data.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        return dateComparison !== 0 ? dateComparison : b.id - a.id;
      });
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [jwtToken,csrfToken]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const handleExpenseAdded = () => {
      // Fetch the latest transactions after a new expense is added
      fetchTransactions();
    };

    window.addEventListener('expenseAdded', handleExpenseAdded);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('expenseAdded', handleExpenseAdded);
    };
  }, [fetchTransactions]);

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
        // Trigger a success notification for deletion
        toast.success('Transaction deleted successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Fetch the latest transactions after successful deletion
        fetchTransactions();

        // Dispatch the 'update' event to notify other components
        window.dispatchEvent(new Event('update'));
        setSelectedTransaction(null);
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
        // Trigger a success notification
        toast.success('Transaction updated successfully', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Fetch the latest transactions after successful update
        fetchTransactions();

        // Dispatch the 'update' event to notify other components
        window.dispatchEvent(new Event('update'));
        setSelectedTransaction(null);
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };
  

  return (
    <div className="App">
      <ToastContainer />
      <table className="transaction-table">
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
    </div>
  );
}

export default RecentTransaction;
