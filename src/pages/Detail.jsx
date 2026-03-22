import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Clock, Calendar } from 'lucide-react'
import { api } from '../api'
import { toast } from '../components/Toast'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function readTime(text = '') {
  return Math.max(1, Math.round(text.split(/\s+/).length / 200))
}
function getInitial(name = '') {
  return (name?.trim()?.[0] || 'A').toUpperCase()
}

export default function Detail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [blog,     setBlog]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [confirm,  setConfirm]  = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.getOne(id)
      .then(setBlog)
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(id)
      toast.success('Post deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-72 bg-gray-200 rounded-2xl" />
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2 pt-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
      </div>
    </div>
  )

  if (!blog) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Post not found.</p>
      <Link to="/" className="text-violet-600 font-medium hover:underline">← Back to blog</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-8 no-underline">
        <ArrowLeft size={15} /> Back to blog
      </Link>

      {blog.image && (
        <div className="rounded-2xl overflow-hidden aspect-video mb-8">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(blog.createdAt)}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {readTime(blog.content)} min read</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {getInitial(blog.author)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{blog.author || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">Author</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/edit/${id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors no-underline">
            <Pencil size={13} /> Edit
          </Link>
          <button onClick={() => setConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 mb-8" />

      <div className="space-y-5">
        {blog.content?.split(/\n+/).filter(Boolean).map((para, i) => (
          <p key={i} className="text-base text-gray-700 leading-relaxed">{para}</p>
        ))}
      </div>

      <div className="flex items-center justify-between mt-14 pt-6 border-t border-gray-100 flex-wrap gap-3">
        <Link to="/"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-violet-400 hover:text-violet-600 transition-colors no-underline">
          <ArrowLeft size={14} /> All Posts
        </Link>
        <Link to="/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors no-underline">
          Write a Post
        </Link>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete this post?</h3>
            <p className="text-sm text-gray-500 mb-6">"{blog.title}" will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}