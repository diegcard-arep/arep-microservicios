import { useState } from 'react'
import { postService } from '../services/postService'

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Por favor escribe algo')
      return
    }

    if (content.length > 140) {
      alert('El post no puede exceder 140 caracteres')
      return
    }

    setLoading(true)
    try {
      await postService.createPost(content)
      setContent('')
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error al crear el post. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const charCount = content.length
  const isNearLimit = charCount > 120

  return (
    <div className="card create-post">
      <h2>¿Qué está pasando?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="content"
          placeholder="Escribe algo... (máx. 140 caracteres)"
          maxLength="140"
          required
          className="post-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-footer">
          <span className={`char-count ${isNearLimit ? 'warning' : ''}`}>
            {charCount}/140
          </span>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePost

