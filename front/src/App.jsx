import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import HomePage from './pages/HomePage';
import Step3 from './pages/step3';
import SendMoney from './components/SendMoney';
import RequestLink from './components/RequestLink';
import RequestComplete from './components/RequestComplete';


=======
import Top from './pages/Top';
import AddressList from './pages/AddressList';
import SendMoney from './pages/SendMoney';
>>>>>>> 5f0619552e1f640ff4847c9e74f981bd51f39498

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