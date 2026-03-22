import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X, Loader2, Save } from 'lucide-react'
import { api } from '../api'
import { toast } from './Toast'

export default function BlogForm({ initial = null }) {
  const isEdit   = !!initial?._id
  const navigate = useNavigate()

  const [title,   setTitle]   = useState(initial?.title   || '')
  const [content, setContent] = useState(initial?.content || '')
  const [author,  setAuthor]  = useState(initial?.author  || '')
  const [preview, setPreview] = useState(initial?.image   || '')
  const [imgFile, setImgFile] = useState(null)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const fileRef = useRef()

  const validate = () => {
    const e = {}
    if (!title.trim())      e.title   = 'Title is required'
    if (title.length > 200) e.title   = 'Max 200 characters'
    if (!content.trim())    e.content = 'Content is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title',   title.trim())
      fd.append('content', content.trim())
      fd.append('author',  author.trim())
      if (imgFile) fd.append('image', imgFile)

      if (isEdit) {
        await api.update(initial._id, fd)
        toast.success('Post updated!')
        navigate(`/blog/${initial._id}`)
      } else {
        const saved = await api.create(fd)
        toast.success('Post published!')
        navigate(`/blog/${saved._id}`)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = (hasErr) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900 bg-white outline-none transition-all
     ${hasErr
       ? 'border-red-300 focus:ring-2 focus:ring-red-200'
       : 'border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: ''})) }}
          placeholder="Enter post title…"
          maxLength={200}
          className={inputCls(errors.title)}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className={inputCls(false)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={e => { setContent(e.target.value); setErrors(p => ({...p, content: ''})) }}
          placeholder="Write your post here…"
          rows={12}
          className={`${inputCls(errors.content)} resize-none leading-relaxed`}
        />
        <div className="flex justify-between mt-1">
          {errors.content
            ? <p className="text-red-500 text-xs">{errors.content}</p>
            : <span />
          }
          <p className="text-xs text-gray-400 ml-auto">
            {content.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img src={preview} alt="cover" className="w-full h-48 object-cover" />
            <button type="button"
              onClick={() => { setPreview(''); setImgFile(null) }}
              className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer shadow-sm">
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-violet-400 hover:bg-violet-50/50 transition-all cursor-pointer bg-white">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <ImagePlus size={20} className="text-violet-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-violet-600">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or WEBP · Max 10MB</p>
            </div>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => {
            const f = e.target.files[0]
            if (f) { setImgFile(f); setPreview(URL.createObjectURL(f)) }
          }}
        />
      </div>

      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer">
          {saving
            ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
            : <><Save size={15} /> {isEdit ? 'Update Post' : 'Publish Post'}</>
          }
        </button>
        <button type="button"
          onClick={() => navigate(isEdit ? `/blog/${initial._id}` : '/')}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  )
}