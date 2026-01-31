import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine API base URL
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs`);
        setBlogs(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-neutral-400">Loading blogs...</div>;
  }

  return (
    <div className="border-b border-neutral-900 pb-4">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl"
      >
        My <span className="text-neutral-500">Blogs</span>
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg border border-neutral-800 hover:border-purple-500 transition-colors"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-purple-400">
                {blog.title}
              </h2>
              <p className="text-neutral-400 text-sm mb-4">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="text-neutral-300 mb-4 line-clamp-3">
                {blog.content.substring(0, 150)}...
              </p>
              <Link
                to={`/blogs/${blog._id}`}
                className="inline-block bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Read More
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {blogs.length === 0 && (
        <p className="text-center text-neutral-500">No blogs found.</p>
      )}
    </div>
  );
};

export default Blogs;
