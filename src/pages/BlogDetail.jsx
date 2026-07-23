import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// AsyncLight loads only the languages actually used, on demand - the full
// Prism build ships every grammar (~600KB) in this route's chunk.
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { STATIC_BLOGS } from '../constants';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallbackBlog = STATIC_BLOGS.find((item) => item._id === id);

    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setBlog(fallbackBlog || null);
        setLoading(false);
      }
    };

    if (fallbackBlog) {
      setBlog(fallbackBlog);
      setLoading(false);
      return;
    }

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

  // Quiet, neutral typography - the page title is the only loud element.
  const MarkdownComponents = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ borderRadius: '0.5rem', margin: '1.5rem 0', fontSize: '0.875rem' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-neutral-800/80 px-1.5 py-0.5 rounded text-[0.85em] text-neutral-200`} {...props}>
          {children}
        </code>
      );
    },
    img: (props) => (
        <img {...props} className="rounded-lg my-8 max-h-[500px] w-auto mx-auto" />
    ),
    // The article's own h1 duplicates the page title, so headings step down a level
    h1: (props) => <h1 {...props} className="text-2xl font-semibold mt-12 mb-4 text-neutral-100 tracking-tight" />,
    h2: (props) => <h2 {...props} className="text-xl font-semibold mt-10 mb-3 text-neutral-100 tracking-tight" />,
    h3: (props) => <h3 {...props} className="text-lg font-medium mt-8 mb-2 text-neutral-200" />,
    p: (props) => <p {...props} className="mb-5 text-neutral-400 leading-7" />,
    ul: (props) => <ul {...props} className="list-disc ml-5 mb-5 text-neutral-400 leading-7 marker:text-neutral-600" />,
    ol: (props) => <ol {...props} className="list-decimal ml-5 mb-5 text-neutral-400 leading-7 marker:text-neutral-600" />,
    li: (props) => <li {...props} className="mb-1.5 pl-1" />,
    a: (props) => <a {...props} className="text-purple-300 decoration-purple-300/30 underline underline-offset-4 hover:text-purple-200 transition-colors" target="_blank" rel="noopener noreferrer" />,
    blockquote: (props) => <blockquote {...props} className="border-l-2 border-neutral-700 pl-4 my-6 text-neutral-500" />,
    hr: () => <hr className="border-neutral-800 my-10" />,
  };

  // Drop a leading markdown H1 that just repeats the post title
  const content = blog.content.replace(/^\s*#\s+(.+?)\s*\n+/, (m, heading) =>
    heading.trim().toLowerCase() === blog.title.trim().toLowerCase() ? '' : m,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      <Link
        to="/blogs"
        className="mb-10 inline-block text-sm text-neutral-500 hover:text-neutral-200 transition-colors"
      >
        &larr; Back to Blogs
      </Link>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100 mb-4">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-500 mb-10">
          <time>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          {blog.tags?.length > 0 && <span className="text-neutral-700">·</span>}
          {blog.tags?.slice(0, 4).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className={`w-full rounded-xl mb-12 ${
              blog.imageFit === 'contain'
                ? 'h-auto max-h-[32rem] object-contain'
                : 'h-64 md:h-96 object-cover'
            }`}
          />
        )}
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
          {content}
        </ReactMarkdown>
      </motion.article>
    </div>
  );
};

export default BlogDetail;
