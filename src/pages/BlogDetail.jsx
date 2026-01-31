import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Link to="/blogs" className="text-purple-400 hover:underline">Back to Blogs</Link>
      </div>
    );
  }

  // Custom components for ReactMarkdown to ensure great styling
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-neutral-800 px-1 py-0.5 rounded text-sm text-purple-300`} {...props}>
          {children}
        </code>
      );
    },
    img: (props) => (
        <img {...props} className="rounded-lg shadow-lg my-6 max-h-[500px] w-auto mx-auto border border-neutral-800" />
    ),
    h1: (props) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-purple-100" />,
    h2: (props) => <h2 {...props} className="text-2xl font-semibold mt-6 mb-3 text-purple-200" />,
    h3: (props) => <h3 {...props} className="text-xl font-medium mt-4 mb-2 text-purple-300" />,
    p: (props) => <p {...props} className="mb-4 text-neutral-300 leading-relaxed" />,
    ul: (props) => <ul {...props} className="list-disc ml-6 mb-4 text-neutral-300" />,
    ol: (props) => <ol {...props} className="list-decimal ml-6 mb-4 text-neutral-300" />,
    li: (props) => <li {...props} className="mb-1" />,
    a: (props) => <a {...props} className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer" />,
    blockquote: (props) => <blockquote {...props} className="border-l-4 border-purple-500 pl-4 italic my-4 text-neutral-400 bg-neutral-900/50 p-2 rounded-r" />,
  };

  return (
    <div className="border-b border-neutral-900 pb-4 max-w-4xl mx-auto px-4">
      <Link to="/blogs" className="text-purple-400 hover:underline mb-8 inline-block">&larr; Back to Blogs</Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-2xl border border-neutral-800"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{blog.title}</h1>
        <div className="flex items-center gap-4 text-neutral-400 text-sm mb-8 border-b border-neutral-800 pb-4">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          {blog.tags && blog.tags.map((tag, index) => (
             <span key={index} className="bg-neutral-800 px-3 py-1 rounded-full text-xs border border-neutral-700">#{tag}</span>
          ))}
        </div>
        
        {/* We keep 'prose' but also override with custom components for fine control */}
        <div className="prose prose-invert prose-lg max-w-none">
           <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
           >
              {blog.content}
           </ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
