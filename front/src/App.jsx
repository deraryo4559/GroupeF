import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Step3 from './pages/step3';
import SendMoney from './components/SendMoney';
import RequestLink from './components/RequestLink';
import RequestComplete from './components/RequestComplete';



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/step3" element={<Step3 />} />
          <Route path="/SendMoney" element={<SendMoney />} />
          <Route path="/request" element={<RequestLink />} />
          <Route path="/request/complete" element={<RequestComplete />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;