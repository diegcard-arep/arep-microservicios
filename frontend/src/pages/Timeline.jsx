import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { timelineService } from '../services/timelineService'
import Post from '../components/Post'

function Timeline() {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTimeline()
  }, [])

  const loadTimeline = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await timelineService.getGlobalTimeline(0, 20)
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error loading timeline:', error)
      setError('Error loading timeline')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container main-content">
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="timeline">
        <h2>Timeline Global</h2>
        {loading ? (
          <div className="loading">Cargando posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} onUpdate={loadTimeline} />
          ))
        ) : (
          <div className="card">
            <p>No hay posts aún. ¡Sé el primero en publicar!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeline

