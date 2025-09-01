import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SendMoney from './components/SendMoney';



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SendMoney" element={<SendMoney />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;