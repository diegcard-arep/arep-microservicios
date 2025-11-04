import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export const authService = {
  async checkStatus() {
    const response = await axios.get(`${API_BASE}/api/auth/status`, {
      withCredentials: true
    })
    return response.data
  },

  async login() {
    window.location.href = `${API_BASE}/api/auth/login`
  },

  async logout() {
    await axios.get(`${API_BASE}/api/auth/logout`, {
      withCredentials: true
    })
    window.location.href = '/'
  }
}

