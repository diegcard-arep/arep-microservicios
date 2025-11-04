import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { isAuthenticated, currentUser, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-brand">
          <Link to="/">
            <h1>🐦 Twitter Clone</h1>
          </Link>
        </div>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/">Home</Link>
              <Link to="/timeline">Global Timeline</Link>
              {currentUser && (
                <Link to={`/profile/${currentUser.username}`}>Profile</Link>
              )}
              <button onClick={logout} className="btn-link">Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

