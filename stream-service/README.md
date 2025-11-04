# 📊 Stream Service - Microservicio de Timeline

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900.svg)](https://aws.amazon.com/lambda/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

> Microservicio responsable de generar el timeline global y personalizado, agregando datos de múltiples servicios en la arquitectura de Twitter Clone.

## 📋 Descripción

El **Stream Service** es uno de los tres microservicios principales. Se encarga de:

- ✅ Generar timeline global (todos los posts en orden cronológico inverso)
- ✅ Generar timeline personal (posts de usuarios seguidos)
- ✅ Agregar datos de User Service y Post Service
- ✅ Buscar y filtrar posts
- ✅ Obtener tendencias
- ✅ Optimizar queries a MongoDB

## 🏗️ Arquitectura

```
┌────────────────────────────────────┐
│  AWS API Gateway (/stream/*)       │
└──────────────┬─────────────────────┘
               │ HTTP Request
               ▼
┌────────────────────────────────────┐
│ AWS Lambda (StreamLambdaHandler)   │
│    com.amazonaws.serverless...     │
└──────────────┬─────────────────────┘
               │
               ▼
┌────────────────────────────────────┐
│ Spring Boot Application (Java 17)  │
│                                    │
│  ├── StreamController              │
│  ├── StreamService                 │
│  ├── PostClient (feign/rest)       │
│  ├── UserClient (feign/rest)       │
│  └── SecurityConfig                │
└──────────────┬─────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌──────────┐       ┌────────────┐
│ POST     │       │   USER     │
│ Service  │       │   Service  │
│ (Rest)   │       │   (Rest)   │
└──────────┘       └────────────┘
    │                     │
    └──────────┬──────────┘
               │
               ▼
    ┌────────────────────┐
    │  MongoDB Atlas     │
    │  (Cache)           │
    └────────────────────┘
```

## 🚀 Quick Start

### Requisitos

- Java 17+
- Maven 3.8.0+
- Acceso a User Service y Post Service

### Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/diegcard-arep/arep-microservicios.git
cd arep-taller-7/stream-service

# 2. Configurar variables de entorno
# Actualizar application.properties con URLs de servicios

# 3. Instalar dependencias
mvn clean install

# 4. Ejecutar localmente
mvn spring-boot:run

# El servicio estará disponible en: http://localhost:8083
```

## 📡 Endpoints

### Timeline

#### Obtener Timeline Global
```http
GET /api/timeline?page=0&size=20&sort=createdAt,desc
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "userAvatar": "https://example.com/avatar.jpg",
      "content": "Mi primer post de Twitter Clone!",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 45,
      "comments": 12,
      "likedByMe": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "totalPages": 5,
    "totalElements": 87
  }
}
```

#### Obtener Timeline Personal (de usuario seguido)
```http
GET /api/timeline/user/{userId}?page=0&size=20
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "userAvatar": "https://example.com/avatar.jpg",
      "content": "Mi primer post",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 45,
      "comments": 12,
      "likedByMe": false
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "totalPages": 2,
    "totalElements": 42
  }
}
```

### Búsqueda y Filtrado

#### Buscar Posts por Keyword
```http
GET /api/timeline/search?q=spring&page=0&size=10
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  q       : Palabra clave de búsqueda (requerido)
  page    : Número de página (default: 0)
  size    : Tamaño de página (default: 10)
  sort    : Orden de resultados (default: createdAt,desc)
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "content": "Aprendiendo Spring Boot en la escuela",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 23
    }
  ],
  "total": 5
}
```

#### Filtrar por Usuario
```http
GET /api/timeline/user/{userId}/posts?page=0&size=10
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "username": "juan_perez",
      "content": "Post del usuario",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 45
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalElements": 42
  }
}
```

### Tendencias

#### Obtener Tendencias
```http
GET /api/timeline/trending?limit=10
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  limit : Número máximo de tendencias (default: 10)
  hours : Últimas N horas a considerar (default: 24)
```

Response (200 OK):
```json
{
  "trending": [
    {
      "keyword": "spring",
      "count": 245,
      "posts": 45
    },
    {
      "keyword": "java",
      "count": 189,
      "posts": 34
    }
  ]
}
```

### Estadísticas

#### Obtener Estadísticas del Timeline
```http
GET /api/timeline/stats
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
{
  "totalPosts": 1245,
  "postsToday": 156,
  "totalUsers": 234,
  "activeUsersToday": 89,
  "averageLikesPerPost": 12.5,
  "averageCommentsPerPost": 2.3,
  "mostPopularPost": {
    "id": "507f1f77bcf86cd799439020",
    "likes": 342,
    "comments": 56
  }
}
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `application.properties`:

```properties
# Server Configuration
server.port=8083
spring.application.name=stream-service

# Service URLs
service.post-service.url=http://localhost:8082
service.user-service.url=http://localhost:8081

# MongoDB Configuration (Optional - Cache)
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/twitter?retryWrites=true&w=majority
spring.data.mongodb.database=twitter

# Security
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json

# Cache Configuration
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.redis.time-to-live=600000

# Pagination Defaults
pagination.default-page-size=20
pagination.max-page-size=100

# Timeline Configuration
timeline.cache-ttl=300
timeline.posts-per-page=20

# Logging
logging.level.com.arep.twitter.streamservice=DEBUG
logging.level.org.springframework.cloud=DEBUG
```

## 💾 Almacenamiento en Caché (Opcional)

### Con Redis

```properties
spring.cache.type=redis
spring.redis.host=your-redis-host
spring.redis.port=6379
spring.cache.redis.time-to-live=600000  # 10 minutos
```

### Con MongoDB Cache

```properties
spring.cache.type=simple
# Los resultados se cachean en memoria
```

## 🧪 Testing

### Ejecutar Pruebas Unitarias

```bash
mvn test
```

### Pruebas de Endpoints con cURL

#### 1. Obtener Timeline Global
```bash
curl -X GET "http://localhost:8083/api/timeline?page=0&size=20" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Accept: application/json"
```

#### 2. Obtener Timeline Personal
```bash
curl -X GET "http://localhost:8083/api/timeline/user/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 3. Buscar Posts
```bash
curl -X GET "http://localhost:8083/api/timeline/search?q=spring&page=0&size=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 4. Obtener Tendencias
```bash
curl -X GET "http://localhost:8083/api/timeline/trending?limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 5. Obtener Estadísticas
```bash
curl -X GET "http://localhost:8083/api/timeline/stats" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 🌐 Despliegue en AWS Lambda

### 1. Construir JAR Optimizado

```bash
mvn clean package
# Genera: target/stream-service-1.0.0-lambda.jar
```

### 2. Crear Función Lambda

```bash
aws lambda create-function \
  --function-name stream-service-handler \
  --runtime java17 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-twitter-role \
  --handler com.amazonaws.serverless.proxy.spring.StreamLambdaHandler::handleRequest \
  --zip-file fileb://target/stream-service-1.0.0-lambda.jar \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables="{
    POST_SERVICE_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod,
    USER_SERVICE_URL=https://def456.execute-api.us-east-1.amazonaws.com/prod,
    REDIS_HOST=your-redis-host,
    CACHE_TTL=300
  }"
```

### 3. Actualizar Función

```bash
aws lambda update-function-code \
  --function-name stream-service-handler \
  --zip-file fileb://target/stream-service-1.0.0-lambda.jar
```

## 📦 Dependencias Principales

```xml
<!-- Spring Boot Web & Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Cloud OpenFeign (para llamadas a otros servicios) -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!-- Spring Cache -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<!-- Redis (para caché distribuido) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- OAuth2 Resource Server (JWT) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<!-- AWS Serverless -->
<dependency>
    <groupId>com.amazonaws.serverless</groupId>
    <artifactId>aws-serverless-java-container-springboot3</artifactId>
    <version>2.1.5</version>
</dependency>
```

## 🔐 Seguridad

### Autenticación JWT

- Todos los endpoints requieren autenticación
- Token JWT validado automáticamente por Spring Security
- Integración con AWS Cognito

### Rate Limiting (Recomendado)

```
Implementar limitador de rate en futuras versiones
Recomendado: 100 requests por minuto por usuario
```

## 📊 Optimización y Caché

### Estrategia de Caché

```
1. Timeline Global: Caché de 5-10 minutos
2. Timeline Personal: Caché de 3-5 minutos
3. Búsquedas: Caché de 10 minutos
4. Tendencias: Caché de 30 minutos
5. Estadísticas: Caché de 1 hora
```

### Índices de MongoDB Recomendados

```javascript
// Para búsquedas rápidas
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ userId: 1, createdAt: -1 });
db.posts.createIndex({ content: "text" });

// Para tendencias
db.posts.createIndex({ likes: -1 });
db.posts.createIndex({ comments: -1 });
```

## 🐛 Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| Service Unavailable | Servicios downstream no disponibles | Verificar que User y Post Services están corriendo |
| Cache miss performance | Caché no configurado | Configurar Redis o MongoDB cache |
| Timeout en Lambda | Queries lentas | Optimizar indices de MongoDB |
| Unauthorized | Token expirado | Generar nuevo token desde Cognito |
| CORS Error | Origen no permitido | Verificar configuración de CORS |

## 📈 Performance Tips

### Para Mejorar Velocidad

1. **Implementar Paginación**: Siempre limitar cantidad de posts retornados
2. **Usar Índices**: Crear índices en campos frecuentemente buscados
3. **Implementar Caché**: Redis para resultados frecuentes
4. **Async/Parallel**: Llamadas paralelas a User y Post Services
5. **Lazy Loading**: Cargar datos adicionales solo cuando sea necesario

### Consultas Recomendadas

```javascript
// Obtener posts más recientes eficientemente
db.posts.find({}).sort({ createdAt: -1 }).limit(20)

// Buscar posts de usuarios específicos
db.posts.find({
  userId: { $in: [id1, id2, id3] }
}).sort({ createdAt: -1 }).limit(20)

// Buscar tendencias
db.posts.aggregate([
  { $group: { _id: null, count: { $sum: 1 } } }
])
```

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** En Producción  
**Escuela Colombiana de Ingeniería Julio Garavito** - AREP
