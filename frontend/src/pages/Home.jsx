import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { timelineService } from '../services/timelineService'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'

function Home() {
  const { isAuthenticated, currentUser, loading, refreshUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated && currentUser) {
      loadTimeline()
    } else if (!loading && isAuthenticated && !currentUser) {
      // User authenticated but not registered
      navigate('/register')
    }
  }, [isAuthenticated, currentUser, loading])

  const loadTimeline = async () => {
    if (!isAuthenticated || !currentUser) return

    setLoadingPosts(true)
    setError(null)
    try {
      const data = await timelineService.getPersonalTimeline(0, 20)
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error loading timeline:', error)
      if (error.response?.status === 404) {
        navigate('/register')
      } else {
        setError('Error loading timeline. Please try again.')
      }
    } finally {
      setLoadingPosts(false)
    }
  }

  const handlePostCreated = () => {
    loadTimeline()
    refreshUser()
  }

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="container main-content">
        <div className="hero">
          <h1>¡Bienvenido a Twitter Clone!</h1>
          <p>Comparte tus pensamientos en 140 caracteres o menos</p>
          <button onClick={() => window.location.href = '/api/auth/login'} className="btn btn-primary btn-large">
            Iniciar Sesión con Cognito
          </button>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="container main-content">
        <div className="card">
          <h2>Bienvenido!</h2>
          <p>Por favor, completa tu registro para continuar.</p>
          <Link to="/register" className="btn btn-primary">
            Completar Registro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container main-content">
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <CreatePost onPostCreated={handlePostCreated} />

      <div className="timeline">
        <h2>Tu Timeline Personal</h2>
        {loadingPosts ? (
          <div className="loading">Cargando posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} onUpdate={loadTimeline} />
          ))
        ) : (
          <div className="card">
            <p>No hay posts aún. ¡Sé el primero en publicar o sigue a alguien!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

