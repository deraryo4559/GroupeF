import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SendMoney from './pages/SendMoney';
import RequestLink from './components/RequestLink';
import RequestComplete from './components/RequestComplete';

import Top from './pages/Top';
import AddressList from './pages/AddressList';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/step3" element={<AddressList />} />
          <Route path="/SendMoney" element={<SendMoney />} />
          <Route path="/request" element={<RequestLink />} />
          <Route path="/request/complete" element={<RequestComplete />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;