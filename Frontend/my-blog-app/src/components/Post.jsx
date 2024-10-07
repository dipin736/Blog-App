import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "./api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "./AuthProvider";
const BlogPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const baseURL = "http://ec2-3-111-33-23.ap-south-1.compute.amazonaws.com/media/blog_images/";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`posts/${id}/`);
        setPost(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.author);
        setImagePreview(`${baseURL}${response.data.image}`);
      } catch (error) {
        console.error("Error fetching the post:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await api.delete(`posts/${id}/`);
      window.location.href = "/";
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.put(`posts/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPost((prevPost) => ({
        ...prevPost,
        title,
        content,
        author,
        image: imagePreview,
      }));
      setIsEditing(false);
      navigate("/posts");
    } catch (error) {
      console.error("Error updating the post:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!post) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full">
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-md w-full p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                className="border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md w-full p-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover mt-2"
                />
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-red-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-2">
              Author: {post.author_username}
            </p>
            <p className="text-gray-500 text-sm mb-2">
              Created at: {new Date(post.created_at).toLocaleDateString()}
            </p>

            <img
              src={`${baseURL}${post.image}`}
              alt={post.title}
              className="w-full h-48 object-cover mb-4"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />

            <div
              className="text-lg text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {user && user.username === post.author_username && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            )}
          </>
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

export default BlogPost;
