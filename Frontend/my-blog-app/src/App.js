import React, { useState, useEffect } from "react";
import {BrowserRouter as Router,Routes,Route,Link,useNavigate} from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import BlogPostList from "./components/PostList";
import BlogPost from "./components/Post";
import { setAuthToken, refreshAccessToken } from "./components/api";
import { useAuth } from "./components/AuthProvider";
import ErrorBoundary from "./components/error";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { user, login, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (username) => {
    login(username);
  };

  const handleLogout = () => {
    setAuthToken(null);
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleLogoutConfirmation = () => {
    setShowLogoutModal(true);
  };

  const handleModalClose = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
        s;
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [logout]);

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
            {user ? (
              <div className="flex items-center">
                <Link
                  to="/profile"
                  className="mr-4 hover:text-gray-300 flex items-center"
                >
                  {user.username}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3J7fax0r25yrhXbt64ICXsKZ-Clm_txAxmw&s"
                    alt="User Icon"
                    className="w-5 h-5 mr-2"
                  />
                </Link>
                <button
                  onClick={handleLogoutConfirmation}
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
