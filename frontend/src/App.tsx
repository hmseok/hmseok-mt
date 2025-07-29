import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CarList from './pages/CarList';
import AccidentList from './pages/AccidentList';
import EstimateList from './pages/EstimateList';
import RepairList from './pages/RepairList';
import AccountingList from './pages/AccountingList';
import StaffList from './pages/StaffList';
import PartList from './pages/PartList';
import PaymentList from './pages/PaymentList';
import TodoList from './pages/TodoList';
import PartnerList from './pages/PartnerList';
import DepositList from './pages/DepositList';
import WithdrawalList from './pages/WithdrawalList';
import ContractList from './pages/ContractList';
import MySchedule from './pages/MySchedule';
import './App.css';

function App() {
  console.log('App component rendered');
  
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/cars" element={<CarList />} />
          <Route path="/accidents" element={<AccidentList />} />
          <Route path="/estimates" element={<EstimateList />} />
          <Route path="/repairs" element={<RepairList />} />
          <Route path="/accounting" element={<AccountingList />} />
          <Route path="/staff" element={<StaffList />} />
          <Route path="/parts" element={<PartList />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/partners" element={<PartnerList />} />
          <Route path="/deposits" element={<DepositList />} />
          <Route path="/withdrawals" element={<WithdrawalList />} />
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/my-schedule" element={<MySchedule />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 