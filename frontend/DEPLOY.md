# Guía de Despliegue en S3

## Opciones de Despliegue

Tienes **DOS opciones** para desplegar según tus necesidades:

### Opción A: Frontend en S3 + Backend en Lambda/EC2 (RECOMENDADO)
- Frontend React → S3 + CloudFront (estático)
- Backend Express → AWS Lambda o EC2
- ✅ Mejor rendimiento
- ✅ Más escalable
- ✅ Más económico

### Opción B: Todo en un servidor (Express sirve React)
- Todo junto en EC2, Elastic Beanstalk, o similar
- Express sirve React compilado
- ✅ Más simple
- ❌ Menos escalable

---

## Opción A: Desplegar Frontend en S3

### Paso 1: Configurar Variables de Entorno para Producción

Crea un archivo `.env.production`:

```env
NODE_ENV=production
VITE_API_BASE=https://tu-dominio-api.com
```

### Paso 2: Build de React para Producción

```bash
npm run build
```

Esto crea la carpeta `dist/` con los archivos estáticos optimizados.

### Paso 3: Configurar S3 Bucket

1. **Crear bucket en S3:**
   ```bash
   aws s3 mb s3://tu-bucket-frontend --region us-east-1
   ```

2. **Configurar bucket para hosting estático:**
   - Ve a S3 → Tu bucket → Properties → Static website hosting
   - Habilita "Static website hosting"
   - Index document: `index.html`
   - Error document: `index.html` (para React Router)

3. **Configurar política de bucket (público):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::tu-bucket-frontend/*"
       }
     ]
   }
   ```

### Paso 4: Subir archivos a S3

```bash
# Sincronizar carpeta dist con S3
aws s3 sync dist/ s3://tu-bucket-frontend --delete

# O usar la consola de AWS
```

### Paso 5: Configurar CloudFront (Opcional pero recomendado)

1. Crear distribución CloudFront
2. Origin: Tu bucket S3
3. Default root object: `index.html`
4. Error pages: 404 → `/index.html` (200)

### Paso 6: Actualizar REDIRECT_URI en Cognito

En AWS Cognito, actualiza el callback URL:
- **REDIRECT_URI**: `https://tu-dominio.com/callback`
- **LOGOUT_URI**: `https://tu-dominio.com`

### Paso 7: Configurar Backend Express (Lambda/EC2)

El backend debe estar en un servidor accesible (Lambda, EC2, etc.) con:
- URL pública: `https://api.tu-dominio.com`
- Variables de entorno actualizadas:
  ```env
  REDIRECT_URI=https://tu-dominio.com/callback
  LOGOUT_URI=https://tu-dominio.com
  NODE_ENV=production
  ```

---

## Opción B: Todo en un Servidor (Express sirve React)

### Paso 1: Build de React

```bash
npm run build
```

### Paso 2: Configurar Variables de Entorno

Crea `.env` en el servidor:

```env
NODE_ENV=production
PORT=3000
CLIENT_SECRET=tu_client_secret
REDIRECT_URI=https://tu-dominio.com/callback
LOGOUT_URI=https://tu-dominio.com
SESSION_SECRET=tu_session_secret
USER_SERVICE_URL=https://tu-user-service.com
POST_SERVICE_URL=https://tu-post-service.com
STREAM_SERVICE_URL=https://tu-stream-service.com
```

### Paso 3: Desplegar en EC2/Elastic Beanstalk

**Opción A: EC2**
```bash
# Subir archivos
scp -r nuevo/ usuario@tu-servidor:/ruta/aplicacion/

# En el servidor
cd /ruta/aplicacion/nuevo
npm install --production
npm run build
npm start
```

**Opción B: Elastic Beanstalk**
1. Crear aplicación en Elastic Beanstalk
2. Subir archivos (ZIP)
3. Configurar variables de entorno en la consola
4. Deploy

**Opción C: Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Scripts de Despliegue

### Script para S3 (deploy-s3.sh)

```bash
#!/bin/bash
# deploy-s3.sh

echo "Building React app..."
npm run build

echo "Syncing to S3..."
aws s3 sync dist/ s3://tu-bucket-frontend --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"

echo "Deploy completed!"
```

### Script para EC2 (deploy-ec2.sh)

```bash
#!/bin/bash
# deploy-ec2.sh

echo "Building React app..."
npm run build

echo "Uploading to server..."
scp -r dist/ server.js package.json .env usuario@servidor:/ruta/aplicacion/

echo "Deploying on server..."
ssh usuario@servidor "cd /ruta/aplicacion && npm install --production && pm2 restart app"
```

---

## Configuración de Vite para Producción

Actualiza `vite.config.js` para usar variables de entorno:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // o '/app/' si está en subdirectorio
  build: {
    outDir: 'dist',
    sourcemap: false, // desactivar en producción
    minify: 'terser'
  },
  // ... resto de configuración
})
```

---

## Checklist de Despliegue

### Antes de Desplegar
- [ ] Build de React ejecutado (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] REDIRECT_URI actualizado en Cognito
- [ ] Backend desplegado y accesible
- [ ] URLs de microservicios actualizadas

### Después de Desplegar
- [ ] Verificar que la app carga correctamente
- [ ] Probar login con Cognito
- [ ] Verificar que las rutas de React Router funcionan
- [ ] Probar funcionalidades (posts, likes, comentarios)
- [ ] Verificar CORS y cookies de sesión

---

## Troubleshooting

### Error: "Cannot find module"
- Verifica que `npm install --production` se ejecutó
- Verifica que `node_modules` está presente

### Error: "API calls failing"
- Verifica que `VITE_API_BASE` está configurado correctamente
- Verifica CORS en el backend
- Verifica que las URLs de los microservicios son correctas

### Error: "React Router 404"
- En S3: Configura error document como `index.html`
- En CloudFront: Configura error pages 404 → `/index.html`

### Error: "Session not working"
- Verifica que cookies `sameSite` está configurado
- Verifica que el dominio del frontend y backend coinciden o están configurados para CORS

---

## Recomendación Final

**Para producción, usa Opción A:**
- Frontend en S3 + CloudFront (rápido, escalable, barato)
- Backend Express en Lambda o EC2
- Mejor separación de responsabilidades
- Más fácil de escalar

