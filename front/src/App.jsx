import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PaymentRequest from './pages/PaymentRequest';
import Help from './pages/Help.jsx';
import SupportAI from "./pages/SupportAI";
import SignUp from './pages/SignUp.jsx';

// 認証が必要なルートを保護するコンポーネント
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // セッションストレージから認証情報を確認
    const saved = sessionStorage.getItem("authUser");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user && user.user_id) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("認証情報の解析エラー:", error);
        sessionStorage.removeItem("authUser");
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
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
          <Route path="/support-ai" element={<SupportAI />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoute><Top /></ProtectedRoute>} />
          <Route path="/step3" element={<ProtectedRoute><AddressList /></ProtectedRoute>} />
          <Route path="/SendMoney" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
          <Route path="/request" element={<ProtectedRoute><RequestLink /></ProtectedRoute>} />
          <Route path="/request/complete" element={<ProtectedRoute><RequestComplete /></ProtectedRoute>} />
          <Route path="/SendMoneyComplete" element={<ProtectedRoute><SendMoneyComplete /></ProtectedRoute>} />
          <Route path="/billing-status" element={<ProtectedRoute><BillingStatus /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/payment/complete" element={<ProtectedRoute><PaymentComplete /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/pay/:token" element={<PaymentRequest />} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/support-ai" element={<ProtectedRoute><SupportAI /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;