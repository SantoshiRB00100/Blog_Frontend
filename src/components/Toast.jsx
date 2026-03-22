import { useState, useEffect } from 'react'
import { X, CheckCircle2, XCircle } from 'lucide-react'

let _add = null
export const toast = {
  success: (msg) => _add?.({ msg, type: 'success' }),
  error:   (msg) => _add?.({ msg, type: 'error' }),
}

export default function Toast() {
  const [items, setItems] = useState([])

  useEffect(() => {
    _add = (item) => {
      const id = Date.now()
      setItems(p => [...p, { ...item, id }])
      setTimeout(() => setItems(p => p.filter(t => t.id !== id)), 3000)
    }
  }, [])

  if (!items.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-999 flex flex-col gap-2">
      {items.map(t => (
        <div key={t.id} className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 text-sm font-medium text-gray-800 min-w-55">
          {t.type === 'success'
            ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            : <XCircle      size={16} className="text-red-500 shrink-0" />
          }
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => setItems(p => p.filter(x => x.id !== t.id))} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}