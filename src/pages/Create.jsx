import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BlogForm from '../components/BlogForm'

export default function Create() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-8 no-underline">
        <ArrowLeft size={15} /> Back to blog
      </Link>
      <div className="mb-8">
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">New Post</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a story</h1>
        <p className="text-gray-500 text-sm">Share your ideas with the world.</p>
      </div>
      <div className="h-px bg-gray-100 mb-8" />
      <BlogForm />
    </div>
  )
}