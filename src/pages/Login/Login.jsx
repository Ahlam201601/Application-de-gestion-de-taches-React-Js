import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('L\'email est requis !');
      hasError = true;
    } else {
      setEmailError('');
    }
    
    if (!password.trim()) {
      setPasswordError('Le mot de passe est requis !');
      hasError = true;
    } else {
      setPasswordError('');
    }
    
    if (hasError) return;
    
    if (onLogin(email, password)) {
      toast.success('Connexion réussie !');
      navigate('/');
    } else {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🗂️ WorkflowHub Lite</h1>
          <p>Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value.trim()) {
                  setEmailError('');
                }
              }}
              onBlur={(e) => {
                if (!e.target.value.trim()) {
                  setEmailError('L\'email est requis !');
                }
              }}
              placeholder="tasks@gmail.com"
            />
            {emailError && <span className="error-message">{emailError}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim()) {
                  setPasswordError('');
                }
              }}
              onBlur={(e) => {
                if (!e.target.value.trim()) {
                  setPasswordError('Le mot de passe est requis !');
                }
              }}
              placeholder="••••••••"
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>

          <button type="submit" className="login-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

