# 📝 Post Service - Microservicio de Gestión de Posts

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900.svg)](https://aws.amazon.com/lambda/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

> Microservicio responsable de la creación, gestión y almacenamiento de posts de 140 caracteres en la arquitectura de Twitter Clone.

## 📋 Descripción

El **Post Service** es uno de los tres microservicios principales. Se encarga de:

- ✅ Crear posts de máximo 140 caracteres
- ✅ Validar integridad de datos de posts
- ✅ Gestionar likes en posts
- ✅ Gestionar comentarios en posts
- ✅ Recuperar posts individuales o por usuario
- ✅ Permitir eliminación de posts

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│     AWS API Gateway (/post/*)           │
└────────────────┬────────────────────────┘
                 │ HTTP Request
                 ▼
┌─────────────────────────────────────────┐
│    AWS Lambda (StreamLambdaHandler)     │
│      com.amazonaws.serverless...        │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Spring Boot Application (Java 17)     │
│                                         │
│  ├── PostController                    │
│  ├── PostService                       │
│  ├── PostRepository                    │
│  └── SecurityConfig                    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│       MongoDB Atlas (Posts DB)           │
│  • Posts Collection                      │
│  • Comments Sub-documents                │
│  • Likes Tracking                        │
└──────────────────────────────────────────┘
```

## 🚀 Quick Start

### Requisitos

- Java 17+
- Maven 3.8.0+
- MongoDB Atlas (conexión configurada)

### Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/diegcard-arep/arep-microservicios.git
cd arep-taller-7/post-service

# 2. Configurar variables de entorno
# Crear/editar application.properties con MongoDB URI

# 3. Instalar dependencias
mvn clean install

# 4. Ejecutar localmente
mvn spring-boot:run

# El servicio estará disponible en: http://localhost:8082
```

## 📡 Endpoints

### Gestión de Posts

#### Crear Post
```http
POST /api/posts
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "content": "Mi primer post de Twitter Clone! Esto es increíble",
  "imageUrl": "https://example.com/image.jpg"
}
```

Response (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439020",
  "userId": "507f1f77bcf86cd799439011",
  "username": "juan_perez",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "Mi primer post de Twitter Clone! Esto es increíble",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "likes": 0,
  "comments": 0,
  "likedByMe": false
}
```

#### Obtener Post por ID
```http
GET /api/posts/{postId}
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
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
  "likedByMe": true,
  "commentsList": [
    {
      "id": "507f1f77bcf86cd799439030",
      "userId": "507f1f77bcf86cd799439012",
      "username": "maria_lopez",
      "content": "¡Excelente post!",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

#### Obtener Posts de un Usuario
```http
GET /api/posts/user/{userId}
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  ?page=0&size=10&sort=createdAt,desc
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "content": "Primer post",
      "createdAt": "2024-01-15T10:30:00Z",
      "likes": 45
    }
  ],
  "pageable": {
    "page": 0,
    "size": 10,
    "total": 42
  }
}
```

#### Obtener Todos los Posts (Paginados)
```http
GET /api/posts
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  ?page=0&size=20&sort=createdAt,desc
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "content": "Mi primer post",
      "likes": 45,
      "comments": 12,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20,
    "totalPages": 3,
    "totalElements": 45
  }
}
```

#### Actualizar Post
```http
PUT /api/posts/{postId}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "Post actualizado con más información",
  "imageUrl": "https://example.com/new-image.jpg"
}
```

Response (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439020",
  "content": "Post actualizado con más información",
  "imageUrl": "https://example.com/new-image.jpg",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

#### Eliminar Post
```http
DELETE /api/posts/{postId}
Authorization: Bearer <JWT_TOKEN>
```

Response (204 No Content)

### Sistema de Likes

#### Dar Like a Post
```http
POST /api/posts/{postId}/like
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

Response (200 OK):
```json
{
  "message": "Like agregado",
  "likes": 46,
  "likedByMe": true
}
```

#### Remover Like
```http
DELETE /api/posts/{postId}/like
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  ?userId=507f1f77bcf86cd799439011
```

Response (200 OK):
```json
{
  "message": "Like removido",
  "likes": 45,
  "likedByMe": false
}
```

#### Obtener Usuarios que Dieron Like
```http
GET /api/posts/{postId}/likes
Authorization: Bearer <JWT_TOKEN>
```

Response (200 OK):
```json
{
  "total": 45,
  "users": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "maria_lopez",
      "firstName": "María",
      "lastName": "López"
    }
  ]
}
```

### Sistema de Comentarios

#### Agregar Comentario
```http
POST /api/posts/{postId}/comments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "content": "¡Excelente post! Totalmente de acuerdo"
}
```

Response (201 Created):
```json
{
  "id": "507f1f77bcf86cd799439030",
  "postId": "507f1f77bcf86cd799439020",
  "userId": "507f1f77bcf86cd799439011",
  "username": "juan_perez",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "¡Excelente post!",
  "createdAt": "2024-01-15T10:35:00Z"
}
```

#### Obtener Comentarios de Post
```http
GET /api/posts/{postId}/comments
Authorization: Bearer <JWT_TOKEN>

Query Parameters:
  ?page=0&size=10
```

Response (200 OK):
```json
{
  "content": [
    {
      "id": "507f1f77bcf86cd799439030",
      "userId": "507f1f77bcf86cd799439011",
      "username": "juan_perez",
      "content": "¡Excelente post!",
      "createdAt": "2024-01-15T10:35:00Z",
      "likes": 5
    }
  ],
  "pageable": {
    "page": 0,
    "size": 10,
    "total": 12
  }
}
```

#### Eliminar Comentario
```http
DELETE /api/posts/{postId}/comments/{commentId}
Authorization: Bearer <JWT_TOKEN>
```

Response (204 No Content)

## 🔧 Configuración

### Variables de Entorno

Crear archivo `application.properties`:

```properties
# Server Configuration
server.port=8082
spring.application.name=post-service

# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/twitter?retryWrites=true&w=majority
spring.data.mongodb.database=twitter

# Security
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json

# Validation
post.max-length=140

# Logging
logging.level.com.arep.twitter.postservice=DEBUG
```

## 💾 Modelo de Datos - MongoDB

### Colección: posts

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  username: String,
  userAvatar: String,
  content: String (max 140 chars),
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [ObjectId],        // Array de IDs de usuarios que dieron like
  likesCount: Number,
  commentsCount: Number,
  comments: [
    {
      _id: ObjectId,
      userId: ObjectId,
      username: String,
      userAvatar: String,
      content: String,
      createdAt: Date,
      updatedAt: Date,
      likes: Number
    }
  ]
}
```

### Ejemplo de Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439020"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "username": "juan_perez",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "Mi primer post de Twitter Clone! Esto es increíble",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z"),
  "likes": [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439013")
  ],
  "likesCount": 2,
  "commentsCount": 1,
  "comments": [
    {
      "_id": ObjectId("507f1f77bcf86cd799439030"),
      "userId": ObjectId("507f1f77bcf86cd799439012"),
      "username": "maria_lopez",
      "userAvatar": "https://example.com/maria.jpg",
      "content": "¡Excelente post!",
      "createdAt": ISODate("2024-01-15T10:35:00.000Z"),
      "updatedAt": ISODate("2024-01-15T10:35:00.000Z"),
      "likes": 0
    }
  ]
}
```

## 🧪 Testing

### Ejecutar Pruebas Unitarias

```bash
mvn test
```

### Pruebas de Endpoints con cURL

#### 1. Crear Post
```bash
curl -X POST http://localhost:8082/api/posts \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "content": "Mi primer post!",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

#### 2. Obtener Post
```bash
curl -X GET http://localhost:8082/api/posts/507f1f77bcf86cd799439020 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 3. Dar Like a Post
```bash
curl -X POST http://localhost:8082/api/posts/507f1f77bcf86cd799439020/like \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011"
  }'
```

#### 4. Agregar Comentario
```bash
curl -X POST http://localhost:8082/api/posts/507f1f77bcf86cd799439020/comments \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "507f1f77bcf86cd799439011",
    "content": "¡Excelente post!"
  }'
```

## 🌐 Despliegue en AWS Lambda

### 1. Construir JAR Optimizado

```bash
mvn clean package
# Genera: target/post-service-1.0.0-lambda.jar
```

### 2. Crear Función Lambda

```bash
aws lambda create-function \
  --function-name post-service-handler \
  --runtime java17 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-twitter-role \
  --handler com.amazonaws.serverless.proxy.spring.StreamLambdaHandler::handleRequest \
  --zip-file fileb://target/post-service-1.0.0-lambda.jar \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables="{
    MONGO_URI=mongodb+srv://...,
    POST_MAX_LENGTH=140
  }"
```

### 3. Actualizar Función

```bash
aws lambda update-function-code \
  --function-name post-service-handler \
  --zip-file fileb://target/post-service-1.0.0-lambda.jar
```

## 📦 Dependencias Principales

```xml
<!-- Spring Boot Web & Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- MongoDB -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
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

### Validaciones

- ✅ Contenido máximo 140 caracteres
- ✅ El usuario solo puede eliminar/editar sus propios posts
- ✅ Solo usuarios autenticados pueden crear posts
- ✅ Validación de userId vs JWT token

### CORS Configuration

```
Allowed Origins: http://localhost:3000, https://yourdomain.com
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
```

## 📊 Índices de MongoDB Recomendados

```javascript
// Índices para optimizar queries
db.posts.createIndex({ userId: 1, createdAt: -1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ "comments.userId": 1 });
db.posts.createIndex({ likes: 1 });
```

## 🐛 Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| Post exceeds 140 characters | Validación del lado del servidor | Verificar longitud antes de enviar |
| MongoDB Connection Refused | URI incorrecta | Verificar MONGO_URI y whitelist |
| Unauthorized | Token expirado o inválido | Generar nuevo token |
| Duplicate key error | El post ya existe | Verificar IDs únicos en MongoDB |
| Lambda Timeout | Operaciones lentas | Optimizar queries o aumentar timeout |

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** En Producción  
**Escuela Colombiana de Ingeniería Julio Garavito** - AREP
