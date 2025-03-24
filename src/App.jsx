import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClusterSpacePage from './pages/ClusterSpacePage';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Главная</Link>
              </li>
              <li>
                <Link to="/cluster-space">Кластерное пространство</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cluster-space" element={<ClusterSpacePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;