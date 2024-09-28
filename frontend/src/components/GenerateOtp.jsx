// src/components/GenerateOtp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GenerateOtp = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleGenerateOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/generate-otp', { email });
      setMessage(response.data.message); 
      if (response.status === 200) {        
        setTimeout(() => {
          navigate('/verify-otp', { state: { email } });
        }, 2000);
      }
    } catch (error) {
      setMessage('Failed to generate OTP');
    }
  };

  return (
    <div className="generate-otp-form">
      <h2>Generate OTP</h2>
      <form onSubmit={handleGenerateOtp}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GenerateOtp;
