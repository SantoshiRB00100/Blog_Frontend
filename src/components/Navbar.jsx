import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-black gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
             MiniBlog
          </span>
        </Link>

        {location.pathname === "/" && (
          <Link
            to="/create"
            className="btn-primary text-sm px-5 py-2.5"
          >
            + New Post
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;