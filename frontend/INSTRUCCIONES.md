# Instrucciones para Ejecutar la Aplicación

## Problema: Error 500 en /api/auth/login

Este error ocurre porque el servidor Express no está corriendo. Necesitas ejecutar DOS procesos simultáneos.

## Solución: Ejecutar en Dos Terminales

### Terminal 1: Servidor Express (Backend API)
```bash
cd nuevo
npm run server
```

O directamente:
```bash
node server.js
```

Deberías ver:
```
Server running on http://localhost:3000
React dev server should be running on http://localhost:5173
OpenID Client initialized successfully
```

### Terminal 2: Vite Dev Server (Frontend React)
```bash
cd nuevo
npm run dev
```

Deberías ver:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la carpeta `nuevo/` con:

```env
NODE_ENV=development
PORT=3000

# AWS Cognito Configuration
CLIENT_SECRET=3ddaqhndbi7tl87j0rj7t1nn7s4asl67vg08u2bak15011sdh2l
REDIRECT_URI=http://localhost:3000/callback
LOGOUT_URI=http://localhost:3000

# Session Secret
SESSION_SECRET=3ddaqhndbi7tl87j0rj7t1nn7s4asl67vg08u2bak15011sdh2l

# Microservices URLs
USER_SERVICE_URL=http://localhost:8081
POST_SERVICE_URL=http://localhost:8082
STREAM_SERVICE_URL=http://localhost:8083
```

## Flujo de Funcionamiento

1. **Vite (puerto 5173)**: Sirve la aplicación React en desarrollo
2. **Express (puerto 3000)**: Maneja todas las rutas `/api/*` y la autenticación
3. **Proxy de Vite**: Redirige automáticamente las peticiones `/api/*` al puerto 3000

## Verificar que Funciona

1. Abre http://localhost:5173 en tu navegador
2. Deberías ver la página de login
3. Al hacer clic en "Iniciar Sesión", debería redirigirte a Cognito (no debería dar error 500)

## Troubleshooting

### Error: ECONNREFUSED
- **Causa**: El servidor Express no está corriendo
- **Solución**: Ejecuta `npm run server` en una terminal separada

### Error: Cannot find module
- **Causa**: Dependencias no instaladas
- **Solución**: Ejecuta `npm install`

### Error: Authentication service not initialized
- **Causa**: Cognito aún no se ha inicializado
- **Solución**: Espera unos segundos después de iniciar el servidor

### El login redirige pero no funciona
- Verifica que el `REDIRECT_URI` en tu `.env` coincida exactamente con el configurado en AWS Cognito
- Debe ser: `http://localhost:3000/callback`

