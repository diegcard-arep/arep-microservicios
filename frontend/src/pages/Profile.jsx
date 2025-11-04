import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import { timelineService } from '../services/timelineService'
import Post from '../components/Post'

function Profile() {
  const { username } = useParams()
  const { currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [username])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await userService.getUserByUsername(username)
      setProfileUser(user)

      if (currentUser) {
        const timelineData = await timelineService.getUserTimeline(
          user.id,
          currentUser.id,
          0,
          20
        )
        setPosts(timelineData.posts || [])
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('User not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Cargando perfil...</div>
  }

  if (error || !profileUser) {
    return (
      <div className="container main-content">
        <div className="alert alert-error">{error || 'Usuario no encontrado'}</div>
      </div>
    )
  }

  return (
    <div className="container main-content">
      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>@{profileUser.username}</h2>
            <p className="profile-email">{profileUser.email}</p>
            {profileUser.bio && (
              <p className="profile-bio">{profileUser.bio}</p>
            )}
            <div className="profile-stats">
              <span>
                <strong>{profileUser.followersCount || 0}</strong> Seguidores
              </span>
              <span>
                <strong>{profileUser.followingCount || 0}</strong> Siguiendo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="timeline">
        <h2>Posts de @{profileUser.username}</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <div className="card">
            <p>Este usuario no ha publicado nada aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

