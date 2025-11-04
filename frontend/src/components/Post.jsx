import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postService } from '../services/postService'
import Comments from './Comments'

function Post({ post, onUpdate }) {
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser || false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0)
  const [loadingComments, setLoadingComments] = useState(false)

  const loadComments = async () => {
    setLoadingComments(true)
    try {
      const response = await postService.getComments(post.id)
      if (response.success) {
        setComments(response.comments || [])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Load comments when comments section is opened
  useEffect(() => {
    if (showComments && comments.length === 0 && !loadingComments) {
      loadComments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postService.unlikePost(post.id)
        setIsLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))
      } else {
        await postService.likePost(post.id)
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Error al procesar la acción. Por favor intenta de nuevo.')
    }
  }

  const handleAddComment = async (content) => {
    try {
      const response = await postService.addComment(post.id, content)
      if (response.success) {
        // Reload comments
        await loadComments()
        setCommentsCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  const toggleComments = () => {
    if (!showComments) {
      // Load comments when opening
      loadComments()
    }
    setShowComments(!showComments)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES')
  }

  return (
    <div className="card post" data-post-id={post.id}>
      <div className="post-header">
        <div className="post-author">
          <Link to={`/profile/${post.username}`}>
            <strong>@{post.username}</strong>
          </Link>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button
          className={`btn-like ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ❤️ <span className="like-count">{likesCount}</span>
        </button>
        <button className="btn-comment" onClick={toggleComments}>
          💬 <span className="comment-count">{commentsCount}</span>
        </button>
      </div>

      {showComments && (
        <Comments
          postId={post.id}
          comments={comments}
          loading={loadingComments}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  )
}

export default Post

