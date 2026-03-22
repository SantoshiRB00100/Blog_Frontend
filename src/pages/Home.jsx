import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Pencil, Trash2, ArrowUpRight, PenLine, X } from 'lucide-react'
import { api } from '../api'
import { toast } from '../components/Toast'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
function getInitial(name = '') {
  return (name?.trim()?.[0] || 'A').toUpperCase()
}

export default function Home() {
  const [blogs,    setBlogs]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [params,   setParams]   = useSearchParams()
  const search = params.get('q') || ''
  const [query, setQuery] = useState(search)

  useEffect(() => {
    api.getAll()
      .then(setBlogs)
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? blogs.filter(b =>
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.author?.toLowerCase().includes(search.toLowerCase()) ||
        b.content?.toLowerCase().includes(search.toLowerCase())
      )
    : blogs

  const handleSearch = (e) => {
    e.preventDefault()
    query.trim() ? setParams({ q: query.trim() }) : setParams({})
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(deleteId)
      setBlogs(p => p.filter(b => b._id !== deleteId))
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Resources & Insights</h1>
        
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-10">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        {search && (
          <button type="button"
            onClick={() => { setQuery(''); setParams({}) }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        )}
      </form>

      {/* Search results count */}
      {search && (
        <p className="text-sm text-gray-500 mb-6 text-center">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for{' '}
          <strong className="text-gray-800">"{search}"</strong>
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded w-4/5" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {search ? 'No results found' : 'No posts yet'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {search ? `Nothing matches "${search}"` : 'Be the first to write something.'}
          </p>
          {!search && (
            <Link to="/create"
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors no-underline">
              <PenLine size={15} /> Write First Post
            </Link>
          )}
        </div>
      )}

      {/* Posts grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog, i) => (
            <div key={blog._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">

              {/* Cover image */}
              <Link to={`/blog/${blog._id}`} className="block h-44 overflow-hidden bg-violet-50 no-underline">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-50 to-violet-100">
                    <span className="text-5xl font-bold text-violet-300">
                      {blog.title?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-violet-600">
                    {formatDate(blog.createdAt)}
                  </span>
                  <Link to={`/blog/${blog._id}`} className="text-gray-400 hover:text-violet-600 transition-colors">
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                <Link to={`/blog/${blog._id}`} className="no-underline">
                  <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2 hover:text-violet-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                </Link>

                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                  {blog.content}
                </p>

                {/* Author + actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {getInitial(blog.author)}
                    </div>
                    <span className="text-xs text-gray-500 truncate max-w-22.5">
                      {blog.author || 'Anonymous'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/edit/${blog._id}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors no-underline">
                      <Pencil size={13} />
                    </Link>
                    <button onClick={() => setDeleteId(blog._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}