import React, { useEffect, useState } from 'react';
import api from './api';
import { useAuth } from './AuthProvider';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    location: '',
    birth_date: '',
    profile_picture: '', // Profile picture field
  });
  const [profilePicture, setProfilePicture] = useState(null); // State for new profile picture
  const [editing, setEditing] = useState(false); // State to toggle between view and edit modes
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const { user } = useAuth(); // Access the logged-in user
  const baseUrl = 'http://localhost:8000'; // Replace with your actual backend URL

  // Fetch profile data from the API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('profile/');
        console.log('Fetched profile:', response.data);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value }); // Update profile state
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // Store the selected image file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', profile.bio);
    formData.append('location', profile.location);
    formData.append('birth_date', profile.birth_date);

    if (profilePicture) {
      formData.append('profile_picture', profilePicture); // Append profile picture if changed
    }

    try {
      // Send a PUT request with formData to update the profile
      await api.put('profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Required for file upload
      });
      setEditing(false); // Exit editing mode after successful update
      setSuccessMessage('Profile updated successfully!'); // Set success message
      // Optionally, refresh the profile data to get the latest changes
      const response = await api.get('profile/'); // Fetch updated profile data
      setProfile(response.data); // Update the profile state with the latest data
      // Automatically hide the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle loading state
  if (!profile || Object.keys(profile).length === 0) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
            {successMessage}
          </div>
        )}
        <p className="mb-2"><span className="font-bold">Username:</span> {user.username}</p>

        {editing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Profile Picture:</label>
              <img 
                src={profilePicture ? URL.createObjectURL(profilePicture) : `${baseUrl}${profile.profile_picture}`} // Preview selected image or existing one
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange} // Handle file input changes
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Bio:</label>
              <input
                type="text"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Location:</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Birth Date:</label>
              <input
                type="date"
                name="birth_date"
                value={profile.birth_date}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)} // Cancel editing
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-700">
            <img 
              src={profile.profile_picture ? `${baseUrl}${profile.profile_picture}` : 'path/to/default-image.png'} // Fallback image if none exists
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="mb-2"><span className="font-bold">Bio:</span> {profile.bio}</p>
            <p className="mb-2"><span className="font-bold">Location:</span> {profile.location}</p>
            <p className="mb-2"><span className="font-bold">Birth Date:</span> {profile.birth_date}</p>
            <button
              onClick={() => setEditing(true)} // Enable editing mode
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Edit Profile
            </button>
          </div>
        )}
          <Link to="/" className="text-blue-500 hover:underline text-lg block mt-4">
          Back to posts
        </Link>
      </div>
    </div>
  );
};

export default Profile;
