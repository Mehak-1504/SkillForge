import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h1 className="app-title">SkillForge</h1>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter your name"
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default Login;