import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from './api'; // Import your api instance
import ReactQuill from 'react-quill'; // Importing a rich text editor

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Rich text content
  const [tags, setTags] = useState(''); // New state for tags
  const [image, setImage] = useState(null); // State for image
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [fieldErrors, setFieldErrors] = useState({}); // Store errors for specific fields
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const response = await api.get(`posts/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content); // Set content for editing
        setTags(response.data.tags); // Set tags for editing
        setIsEditing(true);
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on new submission
    setFieldErrors({}); // Reset field-specific errors

    let hasError = false;
    const errors = {};

    // Check for missing fields and set appropriate error messages
    if (!title.trim()) {
      errors.title = 'Title is required.';
      hasError = true;
    }
    if (!content.trim()) {
      errors.content = 'Content is required.';
      hasError = true;
    }
    if (!tags.trim()) {
      errors.tags = 'Tags are required.';
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors); // Set field-specific errors
      return; // Prevent submission if there are validation errors
    }

    try {
      const postData = new FormData(); // Use FormData for file upload
      postData.append('title', title);
      postData.append('content', content); // Keep inner HTML directly
      postData.append('tags', tags); // Include tags in the post data

      if (image) {
        postData.append('image', image); // Append image if present
      }

      if (isEditing) {
        await api.put(`posts/${id}/`, postData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
          },
        });
      } else {
        await api.post('posts/', postData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
          },
        });
      }
      navigate('/'); // Redirect to home page after submission
    } catch (error) {
      console.error(error);
      setErrorMessage('Error saving post.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isEditing ? 'Edit Post' : 'Create Post'}
        </h2>
        
        {/* Show error message if exists */}
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              required
              className={`w-full px-4 py-2 border ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {/* Display error for Title */}
            {fieldErrors.title && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <ReactQuill 
              value={content} 
              onChange={setContent} 
              placeholder="Content"
              className={`border ${fieldErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
            />
            {/* Display error for Content */}
            {fieldErrors.content && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.content}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className={`w-full px-4 py-2 border ${fieldErrors.tags ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {/* Display error for Tags */}
            {fieldErrors.tags && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.tags}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])} // Handle image selection
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
        <Link to="/" className="text-blue-500 hover:underline text-lg block mt-4">
          Back to posts
        </Link>
      </div>
    </div>
  );
};

export default CreatePost;
