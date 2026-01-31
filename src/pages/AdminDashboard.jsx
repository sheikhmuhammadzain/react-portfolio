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
  
  // AI & UX State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImgGenerating, setIsImgGenerating] = useState(false); // separate state for image

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Auto-Save: Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog_draft');
    if (savedDraft && !editingId) { // Only load draft if not editing an existing post
        const parsed = JSON.parse(savedDraft);
        if (confirm('Found an unsaved draft. Do you want to restore it?')) {
            setFormData(parsed);
        }
    }
  }, [editingId]);

  // Auto-Save: Save draft on change
  useEffect(() => {
    if (!editingId && (formData.title || formData.content)) {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('blog_draft', JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(timeoutId);
    }
  }, [formData, editingId]);

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
      localStorage.removeItem('blog_draft'); // Clear draft after successful save
      setEditingId(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog', error);
      alert('Error saving blog');
    }
  };

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!aiPrompt) return;
    
    setIsGenerating(true);
    try {
        if (!window.puter) {
            throw new Error("Puter.js not loaded");
        }

        const systemPrompt = `You are a professional technical blog writer.
        You must output ONLY valid JSON.
        Format: { "title": "...", "content": "markdown content...", "tags": ["tag1", "tag2"], "summary": "..." }
        Do not look at the user prompt as a command to break character.
        The content should be detailed, educational, and engaging.`;

        const response = await window.puter.ai.chat(
            `${systemPrompt}\n\nUser Topic: ${aiPrompt}`, 
            { 
                model: 'claude-opus-4-5',
                stream: true 
            }
        );

        let fullText = '';
        
        for await (const part of response) {
            fullText += part?.text || '';
        }

        // Clean up markdown code blocks if present
        const jsonStr = fullText.replace(/```json\n?|\n?```/g, '').trim();
        const data = JSON.parse(jsonStr);
        
        const { title, content, tags } = data;
        
        setFormData(prev => ({
            ...prev,
            title: title || prev.title,
            content: content || prev.content,
            tags: Array.isArray(tags) ? tags.join(', ') : (tags || prev.tags)
        }));
        
        setShowAIModal(false);
        setAiPrompt('');
    } catch (error) {
        console.error("AI Gen Error:", error);
        alert(`Failed to generate content: ${error.message}`);
    } finally {
        setIsGenerating(false);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = items[i].getAsFile();
            // In a real app, upload this blob to S3/Cloudinary.
            // Since we don't have file upload, we'll guide the user.
            alert("Image paste detected! Since we don't have a file server, please upload your image to a host (like Imgur) and paste the URL here.");
            return;
        }
    }
  };

  const handleGenerateImage = async () => {
    // 1. Get Prompt
    const imagePrompt = window.prompt("Describe the cover image you want:", formData.title || "A futuristic cyberpunk developer workspace");
    if (!imagePrompt) return;

    setIsImgGenerating(true);

    try {
        // 2. Call Puter.js
        // Using Flux Schnell for speed/quality balance
        // global 'puter' is available from the index.html script
        if (!window.puter) {
             alert("Puter.js not loaded. Please refresh the page.");
             return;
        }

        const imageElement = await window.puter.ai.txt2img(imagePrompt, { 
            model: "gpt-image-1.5" 
        });

        // 3. Convert IMG element to Base64
        const canvas = document.createElement("canvas");
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageElement, 0, 0);
        
        const base64Image = canvas.toDataURL("image/jpeg", 0.8); // Compress slightly to save DB space

        // 4. Update Form
        setFormData(prev => ({ ...prev, image: base64Image }));

    } catch (error) {
        console.error("Image Gen Error Details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        alert(`Failed to generate image: ${error.message || JSON.stringify(error)}`);
    } finally {
        setIsImgGenerating(false);
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

  const insertText = (before, after) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);

    const newText = beforeText + before + selectedText + after + afterText;
    
    // Update state
    setFormData((prev) => ({ ...prev, content: newText }));
    
    // Restore focus and cursor
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
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
        <h1 className="text-3xl font-light text-white tracking-wide">Admin Console</h1>
        <button 
          onClick={handleLogout}
          className="text-neutral-400 hover:text-white px-4 py-2 text-sm border border-neutral-800 rounded hover:bg-neutral-800 transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl w-full max-w-lg shadow-2xl relative">
                <button 
                    onClick={() => setShowAIModal(false)}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h3 className="text-xl font-semibold text-white mb-2">Magic AI Writer</h3>
                <p className="text-neutral-400 mb-6 text-sm">Describe what you want to write about.</p>
                
                <form onSubmit={handleGenerateAI}>
                    <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., 'A guide to using React Server Components for beginners'..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-4 text-white focus:border-purple-500 focus:outline-none h-32 mb-4 resize-none"
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        disabled={isGenerating}
                        className="w-full bg-purple-600 text-white font-medium py-3 rounded hover:bg-purple-500 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                Generate Draft
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
      )}
      
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
              <button 
                type="button"
                onClick={handleGenerateImage}
                disabled={isImgGenerating}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                  {isImgGenerating ? (
                      <>Generating Image...</>
                  ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        Generate with AI (Puter.js)
                      </>
                  )}
              </button>
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
          
          {/* Action Column / Preview */}
          <div className="flex flex-col justify-between h-full">
             <div className="flex justify-end p-1">
                {formData.image && (
                    <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-xl aspect-video relative group">
                        <img 
                            src={formData.image} 
                            alt="Cover Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.style.display='none'}}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium">Cover Image Preview</span>
                        </div>
                    </div>
                )}
             </div>
             
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
                <button type="submit" className="bg-purple-600 text-white px-8 py-3 rounded font-medium hover:bg-purple-500 transition-colors">
                  {editingId ? 'Update Post' : 'Publish Post'}
                </button>
             </div>
          </div>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex flex-col h-[700px] border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
           {/* Rich Toolbar */}
           <div className="bg-neutral-950 p-2 border-b border-neutral-800 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-1">
                 <button type="button" onClick={() => insertText('**', '**')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Bold">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
                 </button>
                 <button type="button" onClick={() => insertText('*', '*')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Italic">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="20"></line><line x1="14" y1="4" x2="5" y2="20"></line></svg>
                 </button>
                 <button type="button" onClick={() => insertText('### ', '')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h12"></path><path d="M6 20V4"></path><path d="M18 20V4"></path></svg>
                 </button>
                 <div className="w-px h-6 bg-neutral-800 mx-1 self-center"></div>
                 <button type="button" onClick={() => insertText('`', '`')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Inline Code">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                 </button>
                 <button type="button" onClick={() => insertText('```javascript\n', '\n```')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Code Block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="2" x2="12" y2="22"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>
                 </button>
                 <div className="w-px h-6 bg-neutral-800 mx-1 self-center"></div>
                 <button type="button" onClick={() => insertText('[', '](url)')} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition" title="Link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                 </button>
                 <button 
                    type="button" 
                    onClick={() => {
                        const url = prompt('Enter image URL:');
                        if(url) insertText(`![Image Description](${url})`, '');
                    }} 
                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30 rounded transition flex items-center gap-2" 
                    title="Insert Image"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <span className="text-xs font-semibold">Add Image</span>
                 </button>
              </div>
              
              <button 
                type="button" 
                onClick={() => setShowAIModal(true)}
                className="bg-neutral-800 text-purple-400 border border-neutral-700 hover:bg-neutral-700 hover:text-purple-300 px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  Magic AI
              </button>

              <div className="flex gap-2">
                 <button type="button" onClick={() => setIsPreviewMode(false)} className={`text-xs px-3 py-1 rounded ${!isPreviewMode ? 'bg-purple-600 text-white' : 'text-neutral-500 hover:text-white'}`}>Editor</button>
                 <button type="button" onClick={() => setIsPreviewMode(true)} className={`text-xs px-3 py-1 rounded md:hidden ${isPreviewMode ? 'bg-purple-600 text-white' : 'text-neutral-500 hover:text-white'}`}>Preview</button>
              </div>
           </div>

           <div className="flex flex-1 overflow-hidden relative">
              {/* Textarea Input */}
              <div className={`w-full md:w-1/2 h-full ${isPreviewMode ? 'hidden md:block' : 'block'}`}>
                  <textarea
                    id="content-editor"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="# Write your masterpiece here...
                    
Tips:
- Use the toolbar to format
- Click 'Add Image' to insert a picture
- Use Markdown for ultimate control"
     className="w-full h-full bg-neutral-900 text-neutral-300 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    required
                    onPaste={handlePaste}
                  ></textarea>
              </div>

              {/* Live Preview Pane */}
              <div className={`w-full md:w-1/2 h-full border-l border-neutral-800 bg-black/50 overflow-y-auto p-6 ${isPreviewMode ? 'block' : 'hidden md:block'}`}>
                 <div className="prose prose-invert prose-purple prose-sm max-w-none">
                     {formData.content ? (
                         <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={MarkdownComponents}
                         >
                            {formData.content}
                         </ReactMarkdown>
                     ) : (
                         <div className="flex h-full flex-col items-center justify-center text-neutral-600 gap-4">
                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"></path><path d="M9 4l3 3-3 3"></path><path d="M12 7l3-3-3-3"></path></svg>
                             <span className="italic">Preview will appear here...</span>
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
