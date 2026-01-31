import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine API base URL
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-neutral-400">Loading blog...</div>;
  }

  if (!blog) {
    return (
      <div className="text-center mt-20">
        <p className="text-neutral-400">Blog not found.</p>
        <Link to="/blogs" className="text-cyan-500 hover:underline">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="border-b border-neutral-900 pb-4 max-w-4xl mx-auto">
      <Link to="/blogs" className="text-cyan-500 hover:underline mb-8 inline-block">&larr; Back to Blogs</Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-100">{blog.title}</h1>
        <div className="flex items-center gap-4 text-neutral-400 text-sm mb-8">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.tags && blog.tags.map((tag, index) => (
             <span key={index} className="bg-neutral-800 px-2 py-1 rounded-full text-xs">#{tag}</span>
          ))}
        </div>
        
        <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
           </ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
