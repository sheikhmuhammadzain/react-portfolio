import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { STATIC_BLOGS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mergeBlogs = (apiBlogs = []) => {
      const apiIds = new Set(apiBlogs.map((blog) => blog._id));
      const merged = [...apiBlogs, ...STATIC_BLOGS.filter((blog) => !apiIds.has(blog._id))];
      return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs`);
        setBlogs(mergeBlogs(res.data || []));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs(mergeBlogs([]));
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-20 text-neutral-400">Loading blogs...</div>;
  }

  return (
    <div className="border-b border-neutral-900 pb-4 min-h-screen">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-16 text-center text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-100"
      >
        My Blogs
      </motion.h1>

      {/* Professional Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-16 px-4"
      >
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.8} className="text-neutral-500 group-focus-within:text-neutral-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full leading-5 bg-neutral-900/80 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:bg-neutral-900 focus:ring-1 focus:ring-neutral-600 sm:text-lg transition-colors hover:bg-neutral-900"
            placeholder="Search topics, tutorials, and insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-0 rounded-full bg-neutral-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-xl -z-10"></div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-8">
        {filteredBlogs.map((blog) => (
          <motion.div
            key={blog._id}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-900/90 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-shadow duration-300 group flex flex-col h-full"
          >
            {blog.image && (
              <div className="relative overflow-hidden h-56">
                 <img
                  src={blog.image}
                  alt={blog.title}
                  className={`w-full h-full transform group-hover:scale-110 transition-transform duration-500 ${
                    blog.imageFit === 'contain'
                      ? 'object-contain bg-neutral-950 p-2'
                      : 'object-cover'
                  }`}
                />
                {blog.imageFit !== 'contain' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                )}
              </div>
            )}
            <div className={`p-8 flex flex-col flex-grow ${!blog.image ? 'pt-8' : ''}`}>
              <div className="flex items-center gap-2 mb-4 text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-neutral-100 group-hover:text-neutral-300 transition-colors line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-neutral-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                {
                   blog.content
                   .replace(/([#*`])/g, '') // Basic markdown strip
                   .substring(0, 120)
                }...
              </p>
              <Link
                to={`/blogs/${blog._id}`}
                className="inline-flex items-center justify-center w-full bg-neutral-800/80 text-neutral-300 px-6 py-3 rounded-xl hover:bg-neutral-700 hover:text-white transition-colors duration-300 font-medium"
              >
                Read Article
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      {!loading && filteredBlogs.length === 0 && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20"
        >
            <div className="inline-block p-4 rounded-full bg-neutral-800/50 mb-4">
                <HugeiconsIcon icon={Search01Icon} size={36} strokeWidth={1.8} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-medium text-neutral-300 mb-2">No results found</h3>
            <p className="text-neutral-500">Try adjusting your search terms</p>
        </motion.div>
      )}
    </div>
  );
};

export default Blogs;
