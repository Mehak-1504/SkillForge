import React, { useState } from 'react';
import axios from 'axios';
import './UploadResume.css';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setData(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobRole) {
      alert("Please select a file and job role");
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', jobRole);

    try {
      const res = await axios.post('http://localhost:5000/api/resume/upload', formData);
      console.log("🚀 Full Response:", res.data);
      setData(res.data); // Store full response
      setMessage(res.data.msg || 'Resume uploaded successfully!');
    } catch (err) {
      setMessage('Error uploading resume');
      console.error(err);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Resume</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div style={{ marginBottom: '10px' }}>
          <label>Select Job Role:&nbsp;</label>
          <select value={jobRole} onChange={(e) => setJobRole(e.target.value)} required>
            <option value="">-- Select Role --</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="ML Engineer">ML Engineer</option>
          </select>
        </div>

        <input type="file" onChange={handleFileChange} accept=".pdf" required />
        <button type="submit">Upload Resume</button>
      </form>

      {message && <p className="message">{message}</p>}

      {data?.data && (
        <div className="result">
          <h3>Extracted Details</h3>
          <p><strong>Name:</strong> {data.data.name}</p>
          <p><strong>Email:</strong> {data.data.email}</p>
          <p><strong>Phone:</strong> {data.data.phone}</p>
          <p><strong>Skills:</strong> {data.data.skills.join(', ')}</p>
        </div>
      )}

      {data?.missingSkills?.length > 0 && (
        <div className="result">
          <h3>Missing Skills for {data.jobRole}:</h3>
          <ul>
            {data.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {data?.recommendedResources && Object.keys(data.recommendedResources).length > 0 && (
        <div className="result">
          <h3>Recommended Resources</h3>
          <ul>
            {Object.entries(data.recommendedResources).map(([skill, link]) => (
              <li key={skill}>
                <strong>{skill}:</strong> <a href={link} target="_blank" rel="noreferrer">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
