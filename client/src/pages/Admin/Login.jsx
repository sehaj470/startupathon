import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with API endpoint:', API_ENDPOINTS.LOGIN);
      
      const data = await apiRequest('post', API_ENDPOINTS.LOGIN, {
        email,
        password
      });
      
      console.log('Login successful, received response:', { 
        role: data.role,
        tokenReceived: !!data.token
      });
      
      // Store just the token without 'Bearer' prefix
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      
      navigate('/admin/challenges');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0111] flex items-center justify-center">
      <div className="bg-[#1c0c2e] p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#7F5ED5] text-white p-2 rounded hover:bg-[#855DEF] transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;