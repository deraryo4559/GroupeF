import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Step3 from './pages/step3';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/step3" element={<Step3 />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;