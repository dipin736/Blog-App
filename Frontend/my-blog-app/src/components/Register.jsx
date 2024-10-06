import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState(''); // State for bio
  const [location, setLocation] = useState(''); // State for location
  const [birthDate, setBirthDate] = useState(''); // State for birth date
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [errorMessage, setErrorMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false); // State for success modal
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on new submission

    // Validate mandatory fields
    if (!username || !email || !password) {
      setErrorMessage('Please fill in all mandatory fields: Username, Email, and Password.');
      return; // Prevent form submission
    }

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('bio', bio);
    formData.append('location', location);
    formData.append('birth_date', birthDate);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture); // Append the profile picture
    }

    try {
      await api.post('register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });
      setSuccessModal(true); // Show success modal on successful registration

      // Automatically close the modal after 3 seconds and navigate to login
      setTimeout(() => {
        setSuccessModal(false); // Close the modal
        navigate('/login'); // Navigate to login page
      }, 3000); // 3000 milliseconds = 3 seconds
    } catch (error) {
      if (error.response && error.response.data && error.response.data.username) {
        setErrorMessage(error.response.data.username[0]); // Set the error message
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Show error message if exists */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Success modal */}
        {successModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-md text-center">
              <h2 className="text-lg font-semibold">Registration Successful!</h2>
              <p>You can now log in with your credentials.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username *" // Indicate that this field is mandatory
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *" // Indicate that this field is mandatory
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password *" // Indicate that this field is mandatory
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="Birth Date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])} // Handle file selection
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept="image/*" // Accept image files only
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Register
            </button>
          </div>
        </form>

        {/* Link to login if already have an account */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? 
            <Link to="/login" className="text-blue-500 hover:underline ml-1">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
