import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export const postService = {
  async createPost(content) {
    const response = await axios.post(
      `${API_BASE}/api/posts`,
      { content },
      { withCredentials: true }
    )
    return response.data
  },

  async likePost(postId) {
    const response = await axios.post(
      `${API_BASE}/api/posts/${postId}/like`,
      {},
      { withCredentials: true }
    )
    return response.data
  },

  async unlikePost(postId) {
    const response = await axios.post(
      `${API_BASE}/api/posts/${postId}/unlike`,
      {},
      { withCredentials: true }
    )
    return response.data
  },

  async addComment(postId, content) {
    const response = await axios.post(
      `${API_BASE}/api/posts/${postId}/comments`,
      { content },
      { withCredentials: true }
    )
    return response.data
  },

  async getComments(postId) {
    const response = await axios.get(
      `${API_BASE}/api/posts/${postId}/comments`,
      { withCredentials: true }
    )
    return response.data
  }
}

