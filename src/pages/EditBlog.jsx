import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import BlogForm from "../components/BlogForm";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Fetch failed:", error);
        alert("Could not load post.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleSubmit = async ({ title, author, content, image }) => {
    const data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("content", content);
    if (image) data.append("image", image);

    try {
      await api.put(`/blogs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--rose)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--muted)' }} className="text-sm">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8 fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--rose)' }}>
          ✦ Edit Post
        </p>
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Refine your <span className="gradient-text">story.</span>
        </h1>
      </div>

      <div
        className="rounded-2xl p-7"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <BlogForm initial={blog} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
};

export default EditBlog;