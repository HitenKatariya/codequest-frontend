import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import "./Auth.css"
import icon from '../../assets/icon.png'
import Aboutauth from './Aboutauth'
import { signup, login } from '../../action/auth'
import ForgotPassword from './ForgotPassword';

const Auth = () => {
    const [issignup, setissignup] = useState(false)
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("")
    const [phone, setphone] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handlesubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (!email && !password) {
            setErrorMsg("Enter email and password");
            return;
        }
        if (issignup) {
            if (!name) {
                setErrorMsg("Enter a name to continue");
                return;
            }
            if (!phone) {
                setErrorMsg("Enter a phone number to continue");
                return;
            }
            try {
                await dispatch(signup({ name, email, password, phone }, navigate, setErrorMsg));
            } catch (err) {}
        } else {
            try {
                await dispatch(login({ email, password, phone }, navigate, setErrorMsg));
            } catch (err) {}
        }
    }
    const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        setemail("");
        setpassword("")

    }

    return (
        <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input type="text" id='name' name='name' value={name} onChange={(e) => {
                                setname(e.target.value);
                            }} />
                        </label>
                    )}
                    {issignup && (
                        <label htmlFor="phone">
                            <h4>Phone Number</h4>
                            <input type="tel" id='phone' name='phone' value={phone} onChange={(e) => setphone(e.target.value)} placeholder="Enter phone number" />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input type="email" id='email' name='email' value={email} onChange={(e) => {
                            setemail(e.target.value);
                        }} />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!issignup && (
                                <button type="button" style={{ color: "#007ac6", fontSize: "13px", background: "none", border: "none", cursor: "pointer" }} onClick={() => setShowForgot(true)}>
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => {
                            setpassword(e.target.value)
                        }} />
                    </label>
                    {errorMsg && <div className="auth-error">{errorMsg}</div>}
                    <button type='submit' className='auth-btn' >
                        {issignup ? "Sign up" : "Log in"}
                    </button>
                </form>
                <p>
                    {issignup ? "Already have an account?" : "Don't have an account"}
                    <button type='button' className='handle-switch-btn' onClick={handleswitch}>
                        {issignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
            {showForgot && (
                <ForgotPassword setShowForgot={setShowForgot} />
            )}
        </section>
    )
}

export default Auth