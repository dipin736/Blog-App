import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "./api";
import ReactQuill from "react-quill";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const response = await api.get(`posts/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setTags(response.data.tags);
        setIsEditing(true);
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    let hasError = false;
    const errors = {};

    if (!title.trim()) {
      errors.title = "Title is required.";
      hasError = true;
    }
    if (!content.trim()) {
      errors.content = "Content is required.";
      hasError = true;
    }
    if (!tags.trim()) {
      errors.tags = "Tags are required.";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    try {
      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("tags", tags);

      if (image) {
        postData.append("image", image);
      }

      if (isEditing) {
        await api.put(`posts/${id}/`, postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("posts/", postData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/posts");
    } catch (error) {
      console.error(error);
      setErrorMessage("Error saving post.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isEditing ? "Edit Post" : "Create Post"}
        </h2>

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
              className={`w-full px-4 py-2 border ${
                fieldErrors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
            )}
          </div>
          <div>
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Content"
              className={`border ${
                fieldErrors.content ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
            />
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
              className={`w-full px-4 py-2 border ${
                fieldErrors.tags ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {fieldErrors.tags && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.tags}</p>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
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

export default CreatePost;
