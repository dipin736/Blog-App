import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthProvider";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    location: "",
    birth_date: "",
    profile_picture: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [editing, setEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuth();
  const baseUrl = "http://ec2-3-111-33-23.ap-south-1.compute.amazonaws.com";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profile/");
        console.log("Fetched profile:", response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", profile.bio);
    formData.append("location", profile.location);
    formData.append("birth_date", profile.birth_date);

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      await api.put("profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditing(false);
      setSuccessMessage("Profile updated successfully!");
      const response = await api.get("profile/");
      setProfile(response.data);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

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
        <p className="mb-2">
          <span className="font-bold">Username:</span> {user.username}
        </p>

        {editing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Profile Picture:
              </label>
              <img
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture)
                    : `${baseUrl}${profile.profile_picture}`
                } 
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
              <label className="block text-gray-700 font-bold mb-2">
                Location:
              </label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Birth Date:
              </label>
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
                onClick={() => setEditing(false)}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-gray-700">
            <img
              src={
                profile.profile_picture
                  ? `${baseUrl}${profile.profile_picture}`
                  : "path/to/default-image.png"
              } 
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p className="mb-2">
              <span className="font-bold">Bio:</span> {profile.bio}
            </p>
            <p className="mb-2">
              <span className="font-bold">Location:</span> {profile.location}
            </p>
            <p className="mb-2">
              <span className="font-bold">Birth Date:</span>{" "}
              {new Date(profile.birth_date).toLocaleDateString()}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Edit Profile
            </button>
          </div>
        )}
        <Link
          to="/"
          className="text-blue-500 hover:underline text-lg block mt-4"
        >
          Back to posts
        </Link>
      </div>
    </div>
  );
};

export default Profile;
