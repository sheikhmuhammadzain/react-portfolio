import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/login');
    } else {
      fetchBlogs();
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
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

  return (
    <div className="max-w-4xl mx-auto my-20">
      <h1 className="text-3xl text-center mb-8">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 rounded mb-12 border border-neutral-800">
        <div className="mb-4">
          <label className="block text-neutral-400 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-neutral-800 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-400 mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full bg-neutral-800 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-400 mb-2">Content (Markdown supported)</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className="w-full bg-neutral-800 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            required
          ></textarea>
        </div>

        <div className="mb-4">
            <label className="block text-neutral-400 mb-2">Tags (comma separated)</label>
            <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-neutral-800 text-white p-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
        </div>

        <button type="submit" className="bg-cyan-900 text-white px-6 py-2 rounded hover:bg-cyan-700">
          {editingId ? 'Update Blog' : 'Publish Blog'}
        </button>
        {editingId && (
            <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData({ title: '', content: '', image: '', tags: '' }); }}
                className="ml-4 bg-neutral-700 text-white px-6 py-2 rounded hover:bg-neutral-600"
            >
                Cancel
            </button>
        )}
      </form>

      <div className="space-y-4">
        <h2 className="text-2xl mb-4">Existing Blogs</h2>
        {blogs.map(blog => (
          <div key={blog._id} className="bg-neutral-900 p-4 rounded flex justify-between items-center border border-neutral-800">
            <div>
              <h3 className="text-xl font-bold">{blog.title}</h3>
              <span className="text-sm text-neutral-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <button 
                onClick={() => handleEdit(blog)}
                className="bg-yellow-800 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(blog._id)}
                className="bg-red-900 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
