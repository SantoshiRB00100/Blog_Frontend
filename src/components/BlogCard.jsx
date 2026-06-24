import { Link } from "react-router-dom";
import api from "../services/api";

const IMAGE_BASE = "https://blog-backend-8aq5.onrender.com";

const DELAY_CLASSES = ["", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6"];

const BlogCard = ({ blog, fetchBlogs, index = 0 }) => {
  const handleDelete = async () => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.delete(`/blogs/${blog._id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const delayClass = DELAY_CLASSES[index % DELAY_CLASSES.length];

  return (
    <div className={`card-glow fade-up ${delayClass} flex flex-col`}>
      {/* Image with shimmer */}
      <div className="img-shimmer h-48 w-full flex-shrink-0">
        <img
          src={`${IMAGE_BASE}${blog.image}`}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to top, #161B27, transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <span
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--rose)' }}
        >
          {blog.author}
        </span>

        <h2
          className="text-lg font-bold mb-2 leading-snug"
          style={{ color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}
        >
          {blog.title}
        </h2>

        <p className="text-sm flex-1 leading-relaxed line-clamp-3" style={{ color: 'var(--muted)' }}>
          {blog.content}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-5">
          <Link
            to={`/edit/${blog._id}`}
            className="flex-1 text-center py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: 'var(--surface2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition"
            style={{
              background: 'rgba(255,45,107,0.08)',
              color: 'var(--rose)',
              border: '1px solid rgba(255,45,107,0.2)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,45,107,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,45,107,0.08)'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;