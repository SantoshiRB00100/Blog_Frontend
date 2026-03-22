import { Routes, Route } from 'react-router-dom'
import Navbar  from './components/Navbar'
import Toast   from './components/Toast'
import Home    from './pages/Home'
import Detail  from './pages/Detail'
import Create  from './pages/Create'
import Edit    from './pages/Edit'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/blog/:id" element={<Detail />} />
        <Route path="/create"   element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
      <Toast />
    </div>
  )
}