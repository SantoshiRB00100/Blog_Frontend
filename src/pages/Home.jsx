import { useEffect, useState } from "react";
import api from "../services/api";
import BlogCard from "../components/BlogCard";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Hero header */}
      <div className="mb-12 fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--rose)' }}>
          ✦ Latest Stories
        </p>
        <h1
          className="text-5xl font-black leading-tight mb-3"
          style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}
        >
          Words worth
          <span className="gradient-text"> reading.</span>
        </h1>
        <p style={{ color: 'var(--muted)' }} className="text-base">
          Fresh perspectives, shared ideas, real stories.
        </p>
      </div>

      {/* Divider */}
      <div className="mb-10 h-px" style={{ background: 'var(--border)' }} />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-52 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--rose)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'var(--muted)' }} className="text-sm">Loading posts…</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 fade-up">
          <span className="text-6xl">📝</span>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--text)' }}
          >
            No posts yet
          </h2>
          <p style={{ color: 'var(--muted)' }} className="text-sm">
            Hit "New Post" and be the first to publish.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <BlogCard key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;