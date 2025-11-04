# 🎨 Twitter Clone - Frontend React

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900.svg)](https://aws.amazon.com/s3/)
[![Cognito](https://img.shields.io/badge/AWS-Cognito-FF9900.svg)](https://aws.amazon.com/cognito/)

> Interfaz moderna y responsive de Twitter Clone construida con React 18, Vite y autenticación con AWS Cognito.

## 📋 Descripción

Aplicación frontend estilo Twitter con características modernas:

- ✅ **Autenticación**: OAuth 2.0 con AWS Cognito
- ✅ **Timeline**: Feed global de posts en tiempo real
- ✅ **Crear Posts**: Formulario con validación de 140 caracteres
- ✅ **Interacciones**: Sistema de likes y comentarios
- ✅ **Perfiles**: Visualizar y editar perfiles de usuario
- ✅ **Responsive**: Diseño adaptable a todos los dispositivos
- ✅ **Performance**: Build ultra-rápido con Vite

---

## 📸 Capturas de Pantalla

### Página Principal
![Home Page](../img/index.png)
*Página inicial de bienvenida de la aplicación*

### Autenticación con AWS Cognito
![Login Cognito](../img/login-cognito.png)
*Pantalla de login integrada con AWS Cognito usando OAuth 2.0*

### Timeline Global
![Timeline Page](../img/time-line-page.png)
*Feed de posts mostrando todos los posts en orden cronológico inverso*

### Crear Post
![Initial Page](../img/initial-page.png)
*Interfaz para crear nuevos posts con validación de 140 caracteres*

### Perfil de Usuario
![Profile Page](../img/profile-page.png)
*Perfil de usuario mostrando información personal y posts del usuario*

### Sistema de Comentarios
![Comments Page](../img/comments-page.png)
*Sección de comentarios con posibilidad de agregar nuevos comentarios a los posts*

---

## 🏗️ Arquitectura

### Flujo de Datos

```
┌──────────────────────────┐
│   Navegador del Usuario  │
└────────────┬─────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────┐
│  CloudFront + S3                │
│  • Assets estáticos              │
│  • React Bundle                  │
│  • index.html                    │
└────────────┬────────────────────┘
             │ Requests
             ▼
┌─────────────────────────────────┐
│  Express OAuth Proxy (3000)      │
│  • Manejo de sesiones            │
│  • OpenID Connect                │
│  • JWT Token Management          │
└────────────┬────────────────────┘
             │ API Calls
             ▼
┌──────────────────────────────────┐
│  AWS API Gateway                 │
│  • CORS Habilitado                │
│  • Lambda Proxy Integration       │
└──┬──────────────┬────────────┬───┘
   │              │            │
   ▼              ▼            ▼
User Service  Post Service  Stream Service
   (Lambda)     (Lambda)      (Lambda)
```

---

## 📸 Capturas de Pantalla

### Página Principal
![Home Page](../img/index.png)
*Página inicial de bienvenida de la aplicación*

### Autenticación con AWS Cognito
![Login Cognito](../img/login-cognito.png)
*Pantalla de login integrada con AWS Cognito usando OAuth 2.0*

### Timeline Global
![Timeline Page](../img/time-line-page.png)
*Feed de posts mostrando todos los posts en orden cronológico inverso*

### Crear Post
![Initial Page](../img/initial-page.png)
*Interfaz para crear nuevos posts con validación de 140 caracteres*

### Perfil de Usuario
![Profile Page](../img/profile-page.png)
*Perfil de usuario mostrando información personal y posts del usuario*

### Sistema de Comentarios
![Comments Page](../img/comments-page.png)
*Sección de comentarios con posibilidad de agregar nuevos comentarios a los posts*

---

## 🚀 Guía de Inicio Rápido

### Requisitos

- Node.js 16+ y npm
- Cuenta AWS con Cognito configurado
- Variables de entorno configuradas

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/diegcard-arep/arep-microservicios.git
cd arep-taller-7/frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Copiar .env.example a .env y llenar valores

# 4. Ejecutar en desarrollo
npm run dev:all

# Accesible en: http://localhost:3000
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_URL=http://localhost:3000/auth

# AWS Cognito
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_COGNITO_REDIRECT_URI=http://localhost:3000/callback
VITE_COGNITO_LOGOUT_URI=http://localhost:3000

# Service URLs (Local Development)
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_POST_SERVICE_URL=http://localhost:8082
VITE_STREAM_SERVICE_URL=http://localhost:8083

# Environment
NODE_ENV=development
```

---

## 📦 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/                 # Componentes reutilizables
│   │   ├── Navbar.jsx              # Barra de navegación
│   │   ├── Post.jsx                # Componente de post individual
│   │   ├── Comments.jsx            # Sistema de comentarios
│   │   ├── CreatePost.jsx          # Formulario crear post
│   │   └── ProtectedRoute.jsx      # Rutas protegidas
│   │
│   ├── pages/                      # Páginas principales
│   │   ├── Home.jsx                # Página de inicio
│   │   ├── Login.jsx               # Página de login
│   │   ├── Register.jsx            # Página de registro
│   │   ├── Profile.jsx             # Perfil de usuario
│   │   └── Timeline.jsx            # Feed principal
│   │
│   ├── services/                   # Servicios API
│   │   ├── authService.js          # Autenticación
│   │   ├── userService.js          # Usuarios
│   │   ├── postService.js          # Posts
│   │   └── timelineService.js      # Timeline
│   │
│   ├── contexts/                   # Context API
│   │   └── AuthContext.jsx         # Contexto de autenticación
│   │
│   ├── App.jsx                     # Componente raíz
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globales
│
├── public/                         # Archivos estáticos
│   └── index.html
│
├── server.js                       # Servidor Express (OAuth proxy)
├── package.json
├── vite.config.js                  # Configuración Vite
└── README.md
```

---

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo con hot reload y servidor
npm run dev:all

# Solo Vite dev server
npm run dev

# Solo servidor Express
npm run server

# Build para producción
npm run build

# Preview del build
npm run preview

# Iniciar servidor (producción)
npm start
```

### Desarrollo Local

#### Terminal 1: Servidor Express
```bash
npm run server
```

#### Terminal 2: Vite Dev Server
```bash
npm run dev
```

Luego acceder a `http://localhost:3000`

---

## 🔐 Autenticación con AWS Cognito

### Flujo OAuth 2.0

```
1. Usuario hace click en "Login"
   │
   ▼
2. Redirige a pantalla de Cognito (login)
   │
3. Usuario ingresa credenciales
   │
   ▼
4. Cognito retorna Authorization Code
   │
5. Frontend intercambia código por JWT
   │
   ▼
6. JWT se almacena en localStorage
   │
7. Todos los requests incluyen JWT en Authorization header
   │
   ▼
8. API Gateway y Lambda validan JWT
```

### Configuración en Cognito

1. **Crear User Pool** en AWS Cognito
2. **Crear App Client** con:
   ```
   - Callback URLs: http://localhost:3000/callback
   - Sign out URLs: http://localhost:3000
   - OAuth Flows: Authorization code flow
   - CORS: Habilitar para dominio frontend
   ```
3. **Configurar scopes**: openid, profile, email
4. **Copiar credenciales** a `.env.local`

---

## 🧪 Testing

### Pruebas Manual

#### 1. Flujo Completo de Usuario

```
1. Abrir http://localhost:3000
2. Hacer click en "Register"
3. Llenar formulario de registro
4. Confirmar email (si es requerido)
5. Login con credenciales
6. Ver timeline
7. Crear post
8. Ver post en timeline
9. Dar like a post
10. Comentar en post
```

#### 2. Casos de Prueba

```
✅ Registro de usuario nuevo
✅ Login exitoso
✅ Login con credenciales incorrectas
✅ Token expirado (renovación)
✅ Crear post con texto válido
✅ Crear post con más de 140 caracteres
✅ Dar like a post
✅ Remover like
✅ Agregar comentario
✅ Editar perfil
✅ Seguir usuario
✅ Logout
```

---

## 🌐 Despliegue

### Build para Producción

```bash
npm run build
# Genera carpeta dist/ con los archivos optimizados
```

### Desplegar en S3

```bash
# 1. Crear bucket S3
aws s3 mb s3://twitter-clone-frontend

# 2. Configurar permisos
aws s3api put-bucket-policy --bucket twitter-clone-frontend \
  --policy file://bucket-policy.json

# 3. Subir archivos
aws s3 sync dist/ s3://twitter-clone-frontend --delete

# 4. Configurar website hosting
aws s3 website s3://twitter-clone-frontend \
  --index-document index.html \
  --error-document index.html
```

### Configurar CloudFront

```bash
# Crear distribución con S3 como origen
aws cloudfront create-distribution \
  --distribution-config file://cf-config.json

# Resultado:
# - Domain: d1234abcd5678.cloudfront.net
# - SSL/TLS automático
# - Cache de assets
# - Custom error pages (403/404 → index.html)
```

---

## 📊 Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18.2.0 | Framework de UI |
| **Vite** | 5.0.8 | Build tool |
| **React Router** | 6.20.0 | Enrutamiento SPA |
| **Axios** | 1.6.2 | Cliente HTTP |
| **Express** | 4.21.1 | Servidor OAuth proxy |
| **OpenID Client** | 5.7.0 | OAuth/OpenID conectivity |
| **AWS Cognito** | - | Autenticación |

---

## 🎯 Características por Página

### Home (`/`)
- Login/Logout
- Link a Register
- Información general

### Register (`/register`)
- Formulario de registro
- Validación de campos
- Mensajes de error
- Link a Login

### Login (`/login`)
- Formulario de login
- Autenticación con Cognito
- Redirección a timeline
- Manejo de errores

### Timeline (`/timeline`)
- Feed global de posts
- Crear nuevo post
- Ver posts con detalles
- Sistema de likes
- Comentarios

### Profile (`/profile`)
- Ver información del usuario
- Editar perfil
- Ver posts del usuario
- Seguir/Dejar de seguir

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Cannot GET /" en S3 | Configurar error document → index.html en S3 |
| CORS Error | Verificar CORS en API Gateway y Express |
| Token expirado | Implementar refresh token flow |
| Blank page | Verificar console para errores |
| Servicios no responden | Verificar que servicios Java estén corriendo |

---

## 📝 Notas de Desarrollo

### Context API para Estado Global

```jsx
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Llamadas API Reutilizables

```jsx
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Rutas Protegidas

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? element : <Navigate to="/login" />;
};
```

---

## 🚀 Performance Tips

1. **Lazy Loading de Componentes**:
   ```jsx
   const Timeline = lazy(() => import('./pages/Timeline'));
   ```

2. **Memoización de Componentes**:
   ```jsx
   export default memo(Post);
   ```

3. **Código Splitting**: Automático con Vite

4. **Asset Optimization**: Imágenes optimizadas

---

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [AWS Cognito SDK](https://github.com/aws-amplify/amplify-js)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** En Producción  
**Escuela Colombiana de Ingeniería Julio Garavito** - AREP


### Modo Desarrollo

En modo desarrollo, React corre en Vite (puerto 5173) y el backend Express en el puerto 3000. Vite proxy redirige las peticiones `/api/*` al backend.

### Modo Producción

En modo producción, Express sirve los archivos estáticos de React desde la carpeta `dist` después de ejecutar `npm run build`.

## API Endpoints

El servidor Express proporciona los siguientes endpoints:

### Autenticación
- `GET /api/auth/status` - Estado de autenticación
- `GET /api/auth/login` - Iniciar sesión (redirige a Cognito)
- `GET /api/auth/callback` - Callback de Cognito
- `GET /api/auth/logout` - Cerrar sesión

### Usuarios
- `GET /api/users/current` - Usuario actual
- `POST /api/users/register` - Registrar nuevo usuario
- `GET /api/users/username/:username` - Obtener usuario por username

### Posts
- `POST /api/posts` - Crear post
- `POST /api/posts/:id/like` - Dar like
- `POST /api/posts/:id/unlike` - Quitar like
- `POST /api/posts/:id/comments` - Agregar comentario
- `GET /api/posts/:id/comments` - Obtener comentarios

### Timeline
- `GET /api/timeline/personal` - Timeline personal
- `GET /api/timeline/global` - Timeline global
- `GET /api/timeline/user/:userId` - Timeline de usuario

## Funcionalidades

### Autenticación
- Login con AWS Cognito OAuth
- Manejo de sesiones con Express Session
- Redirección automática a registro si el usuario no existe en BD

### Posts
- Creación de posts con límite de 140 caracteres
- Contador de caracteres en tiempo real
- Validación de longitud

### Interacciones
- Sistema de likes (toggle)
- Sistema de comentarios
- Carga lazy de comentarios

### Navegación
- Rutas protegidas con `ProtectedRoute`
- Manejo de estado de autenticación global con Context API

## Microservicios

La aplicación se comunica con tres microservicios Spring Boot:

1. **User Service** (puerto 8081) - Gestión de usuarios
2. **Post Service** (puerto 8082) - Gestión de posts y comentarios
3. **Stream Service** (puerto 8083) - Gestión de timelines

## Notas

- Las cookies de sesión se configuran con `sameSite: 'lax'` para compatibilidad
- El frontend React usa `withCredentials: true` en todas las peticiones para mantener la sesión
- El contador de caracteres cambia de color cuando se acerca al límite (120+ caracteres)

## Troubleshooting

### Error: "Authentication service not initialized"
- Espera unos segundos después de iniciar el servidor para que Cognito se inicialice
- Verifica que las credenciales de Cognito sean correctas

### Error: CORS
- Asegúrate de que el backend Express esté configurado correctamente
- En desarrollo, Vite proxy maneja esto automáticamente

### Error: "Cannot find module"
- Ejecuta `npm install` para instalar todas las dependencias
- Verifica que estés usando Node.js 16+ con soporte para ES modules

