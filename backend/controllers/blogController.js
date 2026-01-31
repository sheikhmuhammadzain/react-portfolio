import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json(blogs);
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  res.status(200).json(blog);
});

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private (Public for now as no auth implemented yet)
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, image, tags } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const blog = await Blog.create({
    title,
    content,
    image,
    tags,
  });

  res.status(201).json(blog);
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedBlog);
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  await blog.deleteOne();

  res.status(200).json({ id: req.params.id });
});
