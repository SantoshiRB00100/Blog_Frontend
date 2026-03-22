const BASE = '/api/blogs'

async function req(url, options = {}) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Something went wrong')
  }
  return res.json()
}

export const api = {
  getAll:  ()       => req(`${BASE}/getBlogs`),
  getOne:  (id)     => req(`${BASE}/getBlog/${id}`),
  create:  (fd)     => req(`${BASE}/createBlog`,       { method: 'POST', body: fd }),
  update:  (id, fd) => req(`${BASE}/updateBlog/${id}`, { method: 'PUT',  body: fd }),
  delete:  (id)     => req(`${BASE}/deleteBlog/${id}`, { method: 'DELETE' }),
}