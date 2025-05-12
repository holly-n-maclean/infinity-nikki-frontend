import React, { useState } from 'react';
import Axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import  { useAuth } from '../context/AuthContext';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from AuthContext
  const from = location.state?.from || '/'; // Redirect to the page user came from

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token); // store token for use later

      login(res.data.token); 
      navigate(from); 
    } catch (err) {
      console.error(err);
      setErrorMsg('Login failed. Check your username or password.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1rem' }}>Admin Login</h2>
      {errorMsg && <p style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
