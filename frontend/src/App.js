import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
const Home = () => (
  <div className="container mt-5">
    <h1>Welcome to Our App</h1>
    <p>This is a simple full-stack application with React and Express.js</p>
  </div>
);

const About = () => (
  <div className="container mt-5">
    <h1>About</h1>
    <p>This is a simple project template for full-stack development.</p>
  </div>
);

function App() {
  const [serverStatus, setServerStatus] = useState('checking...');

  useEffect(() => {
    // Check if the backend server is running
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('unavailable'));
  }, []);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">FullStack App</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
            </ul>
            <div className="ms-auto text-white">
              Server Status: <span className={`badge ${serverStatus === 'ok' ? 'bg-success' : 'bg-danger'}`}>
                {serverStatus}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
