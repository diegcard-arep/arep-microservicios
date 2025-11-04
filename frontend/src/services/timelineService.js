import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export const timelineService = {
  async getPersonalTimeline(page = 0, size = 20) {
    const response = await axios.get(
      `${API_BASE}/api/timeline/personal?page=${page}&size=${size}`,
      { withCredentials: true }
    )
    return response.data
  },

  async getGlobalTimeline(page = 0, size = 20) {
    const response = await axios.get(
      `${API_BASE}/api/timeline/global?page=${page}&size=${size}`,
      { withCredentials: true }
    )
    return response.data
  },

  async getUserTimeline(userId, currentUserId, page = 0, size = 20) {
    const response = await axios.get(
      `${API_BASE}/api/timeline/user/${userId}?currentUserId=${currentUserId}&page=${page}&size=${size}`,
      { withCredentials: true }
    )
    return response.data
  }
}

