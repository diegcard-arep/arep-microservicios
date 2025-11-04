import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(data.isAuthenticated)
        setUserInfo(data.userInfo || null)
        setCurrentUser(data.currentUser || null)
      } else {
        setIsAuthenticated(false)
        setUserInfo(null)
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = '/api/auth/login'
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setUserInfo(null)
      setCurrentUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const refreshUser = async () => {
    if (isAuthenticated && userInfo) {
      try {
        const user = await userService.getCurrentUser()
        setCurrentUser(user)
        return user
      } catch (error) {
        console.error('Error refreshing user:', error)
        return null
      }
    }
    return null
  }

  const value = {
    isAuthenticated,
    userInfo,
    currentUser,
    loading,
    login,
    logout,
    refreshUser,
    checkAuthStatus
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

