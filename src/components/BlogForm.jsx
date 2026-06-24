import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BlogForm = ({ initial = {}, onSubmit, submitLabel = "Publish Post" }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initial.title || "");
  const [author, setAuthor] = useState(initial.author || "");
  const [content, setContent] = useState(initial.content || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, author, content, image });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 slide-in">

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Title
        </label>
        <input
          type="text"
          className="input-dark"
          placeholder="Give your post a title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Author
        </label>
        <input
          type="text"
          className="input-dark"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Cover Image {initial.title && <span style={{ color: 'var(--border)' }}>— leave blank to keep current</span>}
        </label>

        <label
          className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition"
          style={{
            border: '2px dashed var(--border)',
            background: preview ? 'transparent' : 'var(--surface2)',
            overflow: 'hidden',
            minHeight: preview ? 'auto' : '120px',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--rose)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-52 object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8">
              <span className="text-3xl">🖼️</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>Click to upload image</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
          Content
        </label>
        <textarea
          className="input-dark resize-none"
          rows="9"
          placeholder="Write your post here…"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button type="button" className="btn-ghost flex-1" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;