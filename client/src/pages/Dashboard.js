import React from 'react';
import UploadResume from '../components/UploadResume';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome to SkillForge</h2>
      </header>
      <UploadResume />
    </div>
  );
};

export default Dashboard;