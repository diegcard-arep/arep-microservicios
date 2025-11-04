# ¿Por qué necesitas dos servidores?

## La Situación Actual

En desarrollo necesitas **DOS servidores** porque:

### 1. **Vite (Puerto 5173)** - Frontend React
- Sirve tu aplicación React con **Hot Module Replacement (HMR)**
- Recarga instantáneamente cuando cambias código
- Es MUY rápido para desarrollo
- Solo sirve el frontend (HTML, CSS, JS)

### 2. **Express (Puerto 3000)** - Backend API
- Maneja todas las rutas `/api/*`
- Autenticación con AWS Cognito
- Sesiones de usuario
- Comunicación con microservicios
- **NO** puede servir React con HMR (hot reload)

## ¿Cómo Funcionan Juntos?

```
Navegador (localhost:5173)
    ↓
Vite Dev Server (puerto 5173)
    ↓ (peticiones /api/*)
    ↓ Proxy automático
    ↓
Express Server (puerto 3000)
    ↓
Microservicios (8081, 8082, 8083)
```

**Vite proxy**: Cuando el frontend hace una petición a `/api/auth/login`, Vite automáticamente la redirige al puerto 3000.

## ¿Por qué no un solo servidor?

### Opción 1: Solo Express (MALO para desarrollo)
```javascript
// Express sirve React compilado
app.use(express.static('dist'))
```
❌ **Problemas:**
- Tienes que recompilar cada vez que cambias código (`npm run build`)
- No hay hot reload (muy lento)
- Pierdes toda la velocidad de desarrollo

### Opción 2: Solo Vite (NO funciona)
❌ **Problemas:**
- Vite no puede manejar autenticación con Cognito
- No puede manejar sesiones de Express
- No puede comunicarse con tus microservicios

### Opción 3: Ambos (LO QUE TIENES AHORA - BIEN) ✅
✅ **Ventajas:**
- Hot reload instantáneo (Vite)
- Autenticación y API funcionando (Express)
- Mejor experiencia de desarrollo

## Solución Simplificada

Ahora puedes ejecutar **UN SOLO COMANDO** que inicia ambos:

```bash
npm run dev:all
```

Esto ejecuta ambos servidores simultáneamente usando `concurrently`.

## Instalación

Primero instala la dependencia:

```bash
npm install
```

Luego ejecuta:

```bash
npm run dev:all
```

## Alternativas

### Opción A: Un solo comando (RECOMENDADO)
```bash
npm run dev:all
```

### Opción B: Dos terminales (si prefieres ver logs separados)
```bash
# Terminal 1
npm run dev:server

# Terminal 2  
npm run dev
```

### Opción C: Producción (solo Express)
```bash
npm run build  # Compila React
npm start      # Solo Express sirve todo
```

## Resumen

| Modo | Comando | Servidores | Hot Reload |
|------|---------|------------|------------|
| Desarrollo | `npm run dev:all` | Vite + Express | ✅ Sí |
| Desarrollo (manual) | `npm run dev` + `npm run server` | Vite + Express | ✅ Sí |
| Producción | `npm run build` + `npm start` | Solo Express | ❌ No |

## Conclusión

**Necesitas dos servidores en desarrollo** porque:
1. Vite es excelente para desarrollo frontend (hot reload)
2. Express es necesario para backend (API, auth, sesiones)
3. Juntos te dan la mejor experiencia de desarrollo

**Ahora puedes usar un solo comando:** `npm run dev:all` 🎉

