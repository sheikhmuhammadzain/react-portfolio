import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false); // Toggle for mobile, but on desktop we can show both

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
        navigate('/login');
      } else {
        setIsAuthorized(true);
        fetchBlogs();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchBlogs = async () => {
     try {
        const res = await axios.get(`${API_URL}/blogs`);
        setBlogs(res.data);
     } catch (err) {
        console.error(err);
     }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
    const blogData = { ...formData, tags: tagsArray };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/blogs/${editingId}`, blogData);
      } else {
        await axios.post(`${API_URL}/blogs`, blogData);
      }
      setFormData({ title: '', content: '', image: '', tags: '' });
      setEditingId(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog', error);
      alert('Error saving blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      tags: blog.tags ? blog.tags.join(', ') : '',
    });
    // Scroll to top to see editor
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog', error);
      }
    }
  };

  // Same Markdown components as BlogDetail for consistent preview
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
        <code className={`${className} bg-neutral-800 px-1 py-0.5 rounded text-sm text-cyan-300`} {...props}>
          {children}
        </code>
      );
    },
    img: (props) => (
        <img {...props} className="rounded-lg shadow-lg my-6 max-h-[400px] w-auto mx-auto border border-neutral-800" />
    ),
    h1: (props) => <h1 {...props} className="text-3xl font-bold mt-6 mb-4 text-cyan-50" />,
    h2: (props) => <h2 {...props} className="text-2xl font-semibold mt-5 mb-3 text-cyan-100" />,
    h3: (props) => <h3 {...props} className="text-xl font-medium mt-4 mb-2 text-cyan-200" />,
    p: (props) => <p {...props} className="mb-4 text-neutral-300 leading-relaxed" />,
    ul: (props) => <ul {...props} className="list-disc ml-6 mb-4 text-neutral-300" />,
    ol: (props) => <ol {...props} className="list-decimal ml-6 mb-4 text-neutral-300" />,
    li: (props) => <li {...props} className="mb-1" />,
    a: (props) => <a {...props} className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer" />,
    blockquote: (props) => <blockquote {...props} className="border-l-4 border-cyan-500 pl-4 italic my-4 text-neutral-400 bg-neutral-800/50 p-2 rounded-r" />,
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="max-w-[95%] mx-auto my-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Admin <span className='text-purple-400 font-semibold'>Console</span></h1>
        <button 
          onClick={handleLogout}
          className="bg-red-900/50 text-red-200 border border-red-900 px-4 py-2 rounded hover:bg-red-900 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metadata Column */}
          <div className="space-y-4">
             <div>
              <label className="block text-neutral-400 mb-2 text-sm uppercase tracking-wider">Post Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an engaging title..."
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-2 text-sm uppercase tracking-wider">Cover Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
                <label className="block text-neutral-400 mb-2 text-sm uppercase tracking-wider">Tags (comma separated)</label>
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="react, ai, tutorial"
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded focus:outline-none focus:border-purple-500 transition-colors"
                />
            </div>
          </div>
          
          {/* Action Column */}
          <div className="flex items-end justify-end pb-1">
             <div className="flex gap-4">
                 {editingId && (
                    <button 
                        type="button" 
                        onClick={() => { setEditingId(null); setFormData({ title: '', content: '', image: '', tags: '' }); }}
                        className="bg-neutral-800 text-neutral-300 px-6 py-3 rounded hover:bg-neutral-700 transition-colors"
                    >
                        Cancel Edit
                    </button>
                )}
                <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded font-semibold hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition-all hover:scale-105">
                  {editingId ? 'Update Post' : 'Publish Post'}
                </button>
             </div>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex flex-col h-[700px] border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
           {/* Editor Toolbar (Simple) */}
           <div className="bg-neutral-950 p-3 border-b border-neutral-800 flex justify-between items-center">
              <span className="text-neutral-500 text-sm font-mono">MARKDOWN EDITOR</span>
              <div className="flex gap-2">
                 <button type="button" onClick={() => setIsPreviewMode(false)} className={`text-xs px-3 py-1 rounded ${!isPreviewMode ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>WRITE</button>
                 <button type="button" onClick={() => setIsPreviewMode(true)} className={`text-xs px-3 py-1 rounded md:hidden ${isPreviewMode ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}>PREVIEW</button>
              </div>
           </div>

           <div className="flex flex-1 overflow-hidden relative">
              {/* Textarea Input */}
              <div className={`w-full md:w-1/2 h-full ${isPreviewMode ? 'hidden md:block' : 'block'}`}>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="# Write your masterpiece here..."
                    className="w-full h-full bg-neutral-900 text-neutral-300 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    required
                  ></textarea>
              </div>

              {/* Live Preview Pane */}
              <div className={`w-full md:w-1/2 h-full border-l border-neutral-800 bg-black/50 overflow-y-auto p-6 ${isPreviewMode ? 'block' : 'hidden md:block'}`}>
                 <div className="prose prose-invert prose-sm max-w-none">
                     {formData.content ? (
                         <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={MarkdownComponents}
                         >
                            {formData.content}
                         </ReactMarkdown>
                     ) : (
                         <div className="flex h-full items-center justify-center text-neutral-600 italic">
                             Live preview will appear here...
                         </div>
                     )}
                 </div>
              </div>
           </div>
        </div>

      </form>

      <div className="mt-16">
        <h2 className="text-2xl font-light mb-6 border-b border-neutral-800 pb-2">Recent <span className="text-neutral-500">Posts</span></h2>
        <div className="grid grid-cols-1 gap-4">
            {blogs.map(blog => (
            <div key={blog._id} className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 flex justify-between items-center group hover:border-purple-900/50 transition-colors">
                <div>
                <h3 className="text-xl font-bold text-neutral-200 group-hover:text-purple-400 transition-colors">{blog.title}</h3>
                <span className="text-sm text-neutral-500 font-mono">{new Date(blog.createdAt).toLocaleDateString()} &mdash; {blog.tags ? blog.tags.join(', ') : 'No tags'}</span>
                </div>
                <div className="flex gap-3">
                <button 
                    onClick={() => handleEdit(blog)}
                    className="text-yellow-500 hover:text-yellow-400 px-3 py-1 border border-yellow-900/30 rounded hover:bg-yellow-900/10 transition-colors"
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-500 hover:text-red-400 px-3 py-1 border border-red-900/30 rounded hover:bg-red-900/10 transition-colors"
                >
                    Delete
                </button>
                </div>
            </div>
            ))}
            {blogs.length === 0 && <p className="text-neutral-500 italic">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
