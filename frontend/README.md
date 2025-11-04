# Twitter Clone - React Frontend

Aplicación frontend estilo Twitter construida con React, Vite y Express. Refactorizada desde la implementación original con EJS a React.

## Características

- ✅ Autenticación con AWS Cognito (OAuth/OpenID)
- ✅ Creación de posts de 140 caracteres
- ✅ Timeline personal y global
- ✅ Sistema de likes
- ✅ Sistema de comentarios
- ✅ Perfiles de usuario
- ✅ Diseño responsive y moderno

## Tecnologías

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Express** - Backend API server
- **Axios** - Cliente HTTP
- **AWS Cognito** - Autenticación

## Estructura del Proyecto

```
nuevo/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Post.jsx
│   │   ├── Comments.jsx
│   │   ├── CreatePost.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/          # Páginas principales
│   │   ├── Home.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Timeline.jsx
│   │   └── Login.jsx
│   ├── services/       # Servicios API
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── postService.js
│   │   └── timelineService.js
│   ├── contexts/       # Context API
│   │   └── AuthContext.jsx
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globales
├── server.js           # Servidor Express
├── package.json
├── vite.config.js
└── README.md
```

## Configuración

### Variables de Entorno

El servidor usa las siguientes variables de entorno (opcionales):

```env
PORT=3000
CLIENT_SECRET=your_cognito_client_secret
REDIRECT_URI=http://localhost:3000/api/auth/callback
LOGOUT_URI=http://localhost:3000
USER_SERVICE_URL=http://localhost:8081
POST_SERVICE_URL=http://localhost:8082
STREAM_SERVICE_URL=http://localhost:8083
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Para desarrollo (modo desarrollo con hot reload):
```bash
# Terminal 1: Servidor Express
npm run server

# Terminal 2: Vite dev server
npm run dev
```

3. Para producción:
```bash
# Build de React
npm run build

# Iniciar servidor
npm start
```

## Desarrollo

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

