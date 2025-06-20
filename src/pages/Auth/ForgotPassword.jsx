import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ setShowForgot }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSendOtp = async () => {
    setMsg('');
    try {
      await axios.post('https://codequest-backend-wmll.onrender.com/otp/send-otp', { mobile: phone });
      setStep(2);
      setMsg('OTP sent to your mobile.');
    } catch (err) {
      setMsg('Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setMsg('');
    try {
      await axios.post('https://codequest-backend-wmll.onrender.com/otp/verify-otp', { mobile: phone, code: otp });
      setStep(3);
      setMsg('OTP verified. Enter new password.');
    } catch (err) {
      setMsg('Invalid OTP.');
    }
  };

  const handleResetPassword = async () => {
    setMsg('');
    try {
      await axios.post('https://codequest-backend-wmll.onrender.com/user/reset-password', { phone, newPassword });
      setMsg('Password reset successful!');
      setTimeout(() => setShowForgot(false), 2000);
    } catch (err) {
      setMsg('Failed to reset password.');
    }
  };

  return (
    <div className="forgot-password-modal-overlay">
      <div className="forgot-password-modal">
        <h3>Forgot Password</h3>
        {msg && <div style={{ color: 'red' }}>{msg}</div>}
        {step === 1 && (
          <>
            <input type="tel" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
            <button onClick={handleSendOtp}>Send OTP</button>
          </>
        )}
        {step === 2 && (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}
        {step === 3 && (
          <>
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
        <button onClick={() => setShowForgot(false)} style={{ marginTop: 10 }}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
