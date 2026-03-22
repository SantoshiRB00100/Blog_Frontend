import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../api'
import { toast } from '../components/Toast'
import BlogForm from '../components/BlogForm'

export default function Edit() {
  const { id } = useParams()
  const [blog,    setBlog]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOne(id)
      .then(setBlog)
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
    </div>
  )

  if (!blog) return (
    <div className="text-center py-20">
      <p className="text-gray-500 mb-4">Post not found.</p>
      <Link to="/" className="text-violet-600 font-medium hover:underline">← Back</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to={`/blog/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-8 no-underline">
        <ArrowLeft size={15} /> Back to post
      </Link>
      <div className="mb-8">
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">Editing</p>
        <h1 className="text-2xl font-bold text-gray-900 line-clamp-2">{blog.title}</h1>
      </div>
      <div className="h-px bg-gray-100 mb-8" />
      <BlogForm initial={blog} />
    </div>
  )
}