import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import api, { setAuthToken, storeTokens } from './api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('login/', { username, password });
      setAuthToken(response.data.access); // Set access token
      storeTokens(response.data); // Store tokens in localStorage

      // Capture user ID and username from response
      const userId = response.data.userId; // Adjust this based on your actual response structure
      onLogin(username, userId, response.data); // Pass username, userId, and tokens to the callback

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/'); // Navigate to the home page
      }, 2000);
    } catch (error) {
      console.error(error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account? 
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up here
            </Link>
          </p>
        </div>

        {/* Modal for login success */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-center">Login Successful!</h3>
              <p className="text-center mt-2">You are now logged in.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
