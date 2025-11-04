import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const { isAuthenticated, login } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/'
    }
  }, [isAuthenticated])

  return (
    <div className="container main-content">
      <div className="hero">
        <h1>Iniciar Sesión</h1>
        <p>Por favor, inicia sesión con AWS Cognito para continuar</p>
        <button onClick={login} className="btn btn-primary btn-large">
          Iniciar Sesión con Cognito
        </button>
      </div>
    </div>
  )
}

export default Login

