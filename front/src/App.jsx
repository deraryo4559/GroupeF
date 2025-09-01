import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Top from './pages/Top';
import AddressList from './pages/AddressList';
import SendMoney from './pages/SendMoney';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/step3" element={<AddressList />} />
          <Route path="/SendMoney" element={<SendMoney />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;