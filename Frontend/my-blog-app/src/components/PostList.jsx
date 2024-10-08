import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import { useAuth } from "./AuthProvider";

const BlogPostList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const baseURL = "http://ec2-3-111-33-23.ap-south-1.compute.amazonaws.com";

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await api.get("posts/");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  const handleCreatePost = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-3xl font-semibold mb-6 text-red-600">
        Latest Blog Posts
      </h3>

      <div className="mb-6 text-center">
        <Link
          to="/create"
          onClick={handleCreatePost}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Create New Post
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <Link to={`/posts/${post.id}`} onClick={handleCreatePost}>
              <img
                src={`${baseURL}${post.image}`}
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            </Link>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">
                <Link className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-700 mb-4">
                {post.content.length > 100 ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: post.content.substring(0, 100) + "...",
                    }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </p>
              <p className="text-gray-500 text-sm mb-2">
                Author: {post.author_username}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Created at: {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-2 px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;
