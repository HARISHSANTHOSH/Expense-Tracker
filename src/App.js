
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { Routes,Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddExpenseForm from './components/AddExpense';
import TotalExpense from './components/TotalExpense';
import Registration from './components/Registration';
import ExpenseChart from './components/ExpenseChart';
import RecentTransaction from './components/RecentTranscation';
import HomePage from './components/HomePage';
import EditTransaction from './components/EditTransaction';
import TransactionHistory from './components/HistoryTransaction';
import ExpenseReport from './components/ExpenseReport';
import NavBar from './components/NavBar';
import AboutPage from './components/AboutPage'; 
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
function App() {
  
  
  
  return (
    <div className="App">
    <Routes>
    
      <Route path='login' element={<Login/>}></Route>
       <Route path='navbar' element={<NavBar/>}></Route>
       <Route path='about' element={<AboutPage/>}></Route>
      <Route path='homepage' element={<HomePage/>}></Route>
      <Route path='registration' element={<Registration/>}></Route>
      <Route path='expensechart' element={<ExpenseChart />}></Route>
      <Route path='fetchlatest' element={<RecentTransaction/>}></Route>
      <Route path='edit-transaction/:id' element={<EditTransaction />} />
      <Route path='historytransaction' element={<TransactionHistory/>}></Route>
      <Route path='reports' element={<ExpenseReport/>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
      <Route path="dashboard" element={<Dashboard/>}></Route>
      <Route index element={<Dashboard.Content />} />
      <Route path='newexpense' element={<AddExpenseForm />} ></Route>
      <Route path='totalexpense' element={<TotalExpense />} ></Route>
      
     
    </Routes>
           
    </div>
  );
}

export default App;
