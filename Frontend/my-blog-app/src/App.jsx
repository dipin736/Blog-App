import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BlogPostList from "./components/PostList";
import BlogPost from "./components/Post";
import { setAuthToken, refreshAccessToken } from "./components/api";
import { useAuth } from "./components/AuthProvider"; // Import the useAuth hook
import ErrorBoundary from "./components/error";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  const { user, login, logout } = useAuth(); // Destructure user and login from useAuth
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = (username) => {
    login(username); // Call login function from context
  };

  const handleLogout = () => {
    setAuthToken(null); // Clear the auth token
    logout(); // Call logout function from context
    setShowLogoutModal(false); // Hide the modal after logout
    navigate("/"); // Navigate to home or desired route after logout
  };

  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true); // Show the logout confirmation modal
  };

  const handleModalClose = () => {
    setShowLogoutModal(false); // Close the logout modal
  };

  // Refresh token periodically
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout(); // Logout user if refresh fails
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(intervalId);
  }, [logout]); // Ensure logout is stable

  return (
    <ErrorBoundary>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white">
            <Link to="/" className="mr-4 hover:text-gray-300">
              Home
            </Link>
            <Link to="/posts" className="mr-4 hover:text-gray-300">
              Posts
            </Link>
          </div>
          <div className="text-white">
            {user ? ( // Check if user is logged in
              <div className="flex items-center">
                <Link
                  to="/profile"
                  className="mr-4 hover:text-gray-300 flex items-center"
                >
                 {user.username}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3J7fax0r25yrhXbt64ICXsKZ-Clm_txAxmw&s" // Replace with your user icon URL
                    alt="User Icon"
                    className="w-5 h-5 mr-2" // Adjust the width and height as needed
                  />
                </Link>
                <button
                  onClick={handleLogoutConfirmation} // Call confirmation function
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="mr-4 hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<BlogPostList />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<BlogPostList />} />
          <Route path="/posts/:id" element={<BlogPost />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-center">
              Confirm Logout
            </h3>
            <p className="text-center mt-2">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-around">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default App;
