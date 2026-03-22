import { Link } from 'react-router-dom'
import { PenLine } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-linear-to-r from-sky-400 via-pink-400 to-pink-500 shadow-md sticky top-0 z-50">
      
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        <Link 
          to="/" 
          className="text-lg font-bold text-white no-underline tracking-wide"
        >
          ✦ Blog
        </Link>

        <Link
          to="/create"
          className="flex items-center gap-2 bg-white text-pink-500 hover:bg-pink-50 text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all no-underline"
        >
          <PenLine size={15} />
          New Post
        </Link>

      </div>

    </nav>
  )
}