import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'

function Register() {
  const { userInfo, refreshUser } = useAuth()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('El username es requerido')
      return
    }

    if (username.length < 3 || username.length > 50) {
      setError('El username debe tener entre 3 y 50 caracteres')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('El username solo puede contener letras, números y guion bajo')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await userService.register({
        username: username.trim(),
        email: userInfo.email,
        cognitoSub: userInfo.sub,
        bio: bio.trim() || '',
        profileImageUrl: ''
      })
      
      await refreshUser()
      navigate('/')
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.response?.data?.message || 'Error creating user account')
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) {
    return null
  }

  return (
    <div className="container main-content">
      <div className="card register-card">
        <h2>Completa tu Registro</h2>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email (de Cognito)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userInfo.email}
              readOnly
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              minLength="3"
              maxLength="50"
              pattern="[a-zA-Z0-9_]+"
              placeholder="usuario123"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <small>Solo letras, números y guion bajo. Entre 3 y 50 caracteres.</small>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (Opcional)</label>
            <textarea
              id="bio"
              name="bio"
              maxLength="200"
              placeholder="Cuéntanos sobre ti... (máx. 200 caracteres)"
              className="form-input"
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register

