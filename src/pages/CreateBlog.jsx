import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BlogForm from "../components/BlogForm";

const CreateBlog = () => {
  const navigate = useNavigate();

  const handleSubmit = async ({ title, author, content, image }) => {
    if (!image) return alert("Please select a cover image.");

    const data = new FormData();
    data.append("title", title);
    data.append("author", author);
    data.append("content", content);
    data.append("image", image);

    try {
      await api.post("/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to publish. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8 fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--rose)' }}>
          ✦ New Post
        </p>
        <h1 className="text-4xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Write something <span className="gradient-text">great.</span>
        </h1>
      </div>

      <div
        className="rounded-2xl p-7"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <BlogForm onSubmit={handleSubmit} submitLabel="Publish Post" />
      </div>
    </div>
  );
};

export default CreateBlog;