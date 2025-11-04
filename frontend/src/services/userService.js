import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export const userService = {
  async getCurrentUser() {
    const response = await axios.get(`${API_BASE}/api/users/current`, {
      withCredentials: true
    })
    return response.data
  },

  async getUserByUsername(username) {
    const response = await axios.get(`${API_BASE}/api/users/username/${username}`, {
      withCredentials: true
    })
    return response.data
  },

  async register(userData) {
    const response = await axios.post(`${API_BASE}/api/users/register`, userData, {
      withCredentials: true
    })
    return response.data
  }
}

