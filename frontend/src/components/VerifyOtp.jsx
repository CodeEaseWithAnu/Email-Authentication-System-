import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  
  const location = useLocation();
  let email = location.state?.email;

  const handleVerifyOtp = async (e) => {console.log(email);
    
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/verify-otp', { email, otp });
      setMessage(response.data.message);

      if (response.status === 200) {       
        console.log(response.message);
        
      }
    } catch (error) {
      setMessage('Failed to verify OTP or OTP expired');
    }
  };

  return (
    <div className="verify-otp-form">
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOtp;
