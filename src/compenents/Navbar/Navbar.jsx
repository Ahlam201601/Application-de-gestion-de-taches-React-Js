import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, trashCount, onLogout }) => {
  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">🗂️ WorkflowHub Lite</h1>
        <div className="nav-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/corbeille" className="nav-link">
            🗑️ Corbeille {trashCount > 0 && <span className="trash-count-badge">{trashCount}</span>}
          </Link>
          <button onClick={onLogout} className="nav-link logout-btn">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


