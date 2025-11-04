import { useState, useEffect } from 'react'

function Comments({ postId, comments: initialComments, loading: loadingComments, onAddComment }) {
  const [comments, setComments] = useState(initialComments || [])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)

  // Update comments when prop changes
  useEffect(() => {
    setComments(initialComments || [])
  }, [initialComments])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!commentText.trim()) {
      alert('Por favor escribe un comentario')
      return
    }

    if (commentText.length > 280) {
      alert('El comentario no puede exceder 280 caracteres')
      return
    }

    setLoading(true)
    try {
      await onAddComment(commentText)
      setCommentText('')
      // Comments will be updated by parent component
    } catch (error) {
      alert('Error al agregar comentario. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES')
  }

  return (
    <div className="comments-section">
      <div className="comment-form">
        <form onSubmit={handleSubmit}>
          <textarea
            className="comment-textarea"
            placeholder="Escribe un comentario..."
            maxLength="280"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Comentar'}
          </button>
        </form>
      </div>

      <div className="comments-list">
        {loadingComments ? (
          <p className="no-comments">Cargando comentarios...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-author">
                <strong>@{comment.username}</strong>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        ) : (
          <p className="no-comments">No hay comentarios aún</p>
        )}
      </div>
    </div>
  )
}

export default Comments

