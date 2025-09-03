import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SendMoney from './pages/SendMoney';
import RequestLink from './components/RequestLink';
import RequestComplete from './components/RequestComplete';
import SendMoneyComplete from './pages/SendMoneyComplete';
import Top from './pages/Top';
import AddressList from './pages/AddressList';
import BillingStatus from './pages/BillingStatus';
import Payment from './pages/Payment';
import PaymentComplete from './pages/PaymentComplete';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TransactionsList from './pages/TransactionsList.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/step3" element={<AddressList />} />
          <Route path="/SendMoney" element={<SendMoney />} />
          <Route path="/request" element={<RequestLink />} />
          <Route path="/request/complete" element={<RequestComplete />} />
          <Route path="/SendMoneyComplete" element={<SendMoneyComplete />} />
          <Route path="/billing-status" element={<BillingStatus />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/complete" element={<PaymentComplete />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/TransactionsList" element={<TransactionsList />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;