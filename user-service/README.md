# 👥 User Service - Microservicio de Gestión de Usuarios

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900.svg)](https://aws.amazon.com/lambda/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

> Microservicio responsable de la gestión de usuarios, autenticación y perfiles de usuario en la arquitectura de Twitter Clone.

## 📋 Descripción

El **User Service** es uno de los tres microservicios principales de la aplicación. Se encarga de:

- ✅ Registrar nuevos usuarios
- ✅ Autenticar usuarios mediante AWS Cognito
- ✅ Gestionar perfiles de usuario
- ✅ Gestionar el sistema de seguir/dejar de seguir usuarios
- ✅ Validar credenciales
- ✅ Retornar información de usuario para otros servicios

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│     AWS API Gateway (/user/*)           │
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
│  ├── UserController                    │
│  ├── UserService                       │
│  ├── UserRepository                    │
│  └── SecurityConfig                    │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────┐      ┌──────────────┐
│  MongoDB     │      │ AWS Cognito  │
│  Atlas       │      │  (JWT Auth)  │
│  (Users DB)  │      │              │
└──────────────┘      └──────────────┘
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
cd arep-taller-7/user-service

# 2. Configurar variables de entorno
# Crear/editar application.properties con MongoDB URI y Cognito config

# 3. Instalar dependencias
mvn clean install

# 4. Ejecutar localmente
mvn spring-boot:run

# El servicio estará disponible en: http://localhost:8081
```

## 📡 Endpoints

### Autenticación

#### Registrar Usuario
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "juan_perez",
  "email": "juan@example.com",
  "password": "SecurePass123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response (201 Created)**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "juan_perez",
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "createdAt": "2024-01-15T10:30:00Z",
  "following": [],
  "followers": []
}
```

#### Inicio de Sesión
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "juan_perez",
    "email": "juan@example.com"
  }
}
```

### Gestión de Usuarios

#### Obtener Usuario por ID
```http
GET /api/users/{id}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "juan_perez",
  "email": "juan@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "bio": "Desarrollador apasionado",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "following": ["507f1f77bcf86cd799439012"],
  "followers": ["507f1f77bcf86cd799439013"],
  "postsCount": 42,
  "followersCount": 150,
  "followingCount": 87
}
```

#### Obtener Usuario por Cognito ID
```http
GET /api/users/cognito/{cognitoId}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "cognitoId": "us-east-1_ABC123XYZ",
  "username": "juan_perez",
  "email": "juan@example.com"
}
```

#### Actualizar Perfil de Usuario
```http
PUT /api/users/{id}
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "lastName": "Pérez López",
  "bio": "Desarrollador Full Stack",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response (200 OK)**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "juan_perez",
  "email": "juan@example.com",
  "firstName": "Juan Carlos",
  "lastName": "Pérez López",
  "bio": "Desarrollador Full Stack",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "updatedAt": "2024-01-15T14:45:00Z"
}
```

### Sistema de Seguimiento

#### Seguir Usuario
```http
POST /api/users/{userId}/follow/{targetId}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "message": "Usuario seguido exitosamente",
  "following": true
}
```

#### Dejar de Seguir Usuario
```http
DELETE /api/users/{userId}/follow/{targetId}
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "message": "Usuario dejado de seguir",
  "following": false
}
```

#### Obtener Seguidores
```http
GET /api/users/{id}/followers
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "total": 150,
  "followers": [
    {
      "id": "507f1f77bcf86cd799439013",
      "username": "maria_lopez",
      "email": "maria@example.com",
      "firstName": "María",
      "lastName": "López"
    }
  ]
}
```

#### Obtener Seguidos
```http
GET /api/users/{id}/following
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK)**
```json
{
  "total": 87,
  "following": [
    {
      "id": "507f1f77bcf86cd799439012",
      "username": "carlos_tech",
      "email": "carlos@example.com"
    }
  ]
}
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `application.properties`:

```properties
# Server Configuration
server.port=8081
spring.application.name=user-service

# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/twitter?retryWrites=true&w=majority
spring.data.mongodb.database=twitter

# AWS Cognito Configuration
aws.cognito.region=us-east-1
aws.cognito.userPoolId=us-east-1_ABC123XYZ
aws.cognito.clientId=abcd1234efgh5678ijkl9012
aws.cognito.clientSecret=secret_value_here

# Security
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://cognito-idp.us-east-1.amazonaws.com/us-east-1_ABC123XYZ/.well-known/jwks.json

# Logging
logging.level.com.arep.twitter.userservice=DEBUG
logging.level.org.springframework.security=DEBUG
```

### Configuración de Seguridad Spring

```java
@Configuration
@EnableWebSecurity
@EnableOAuth2ResourceServer
public class SecurityConfig {
    // Validación automática de JWT con Cognito
    // CORS configurado para el frontend
    // Endpoints públicos: /api/users/register, /api/users/login
}
```

## 💾 Modelo de Datos - MongoDB

### Colección: users

```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  cognitoId: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  bio: String,
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date,
  following: [ObjectId],      // IDs de usuarios que sigue
  followers: [ObjectId],      // IDs de seguidores
  isActive: Boolean
}
```

### Ejemplo de Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "juan_perez",
  "email": "juan@example.com",
  "cognitoId": "us-east-1_ABC123XYZ:12345678-1234-1234-1234-123456789012",
  "firstName": "Juan",
  "lastName": "Pérez",
  "bio": "Desarrollador apasionado por la tecnología",
  "avatarUrl": "https://s3.amazonaws.com/avatars/juan_perez.jpg",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T14:45:00.000Z"),
  "following": [
    ObjectId("507f1f77bcf86cd799439012"),
    ObjectId("507f1f77bcf86cd799439014")
  ],
  "followers": [
    ObjectId("507f1f77bcf86cd799439013"),
    ObjectId("507f1f77bcf86cd799439015")
  ],
  "isActive": true
}
```

## 🧪 Testing

### Ejecutar Pruebas Unitarias

```bash
mvn test
```

### Pruebas de Endpoints con cURL

#### 1. Registrar Usuario
```bash
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 2. Obtener Usuario (después de obtener token)
```bash
curl -X GET http://localhost:8081/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 3. Actualizar Perfil
```bash
curl -X PUT http://localhost:8081/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "TestUpdated",
    "bio": "Updated bio"
  }'
```

#### 4. Seguir Usuario
```bash
curl -X POST http://localhost:8081/api/users/507f1f77bcf86cd799439011/follow/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

## 🌐 Despliegue en AWS Lambda

### 1. Construir JAR Optimizado

```bash
mvn clean package
# Genera: target/user-service-1.0.0-lambda.jar
```

### 2. Crear Función Lambda

```bash
aws lambda create-function \
  --function-name user-service-handler \
  --runtime java17 \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-twitter-role \
  --handler com.amazonaws.serverless.proxy.spring.StreamLambdaHandler::handleRequest \
  --zip-file fileb://target/user-service-1.0.0-lambda.jar \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables="{
    MONGO_URI=mongodb+srv://...,
    AWS_COGNITO_REGION=us-east-1,
    AWS_COGNITO_USER_POOL_ID=us-east-1_ABC123XYZ
  }"
```

### 3. Actualizar Función

```bash
aws lambda update-function-code \
  --function-name user-service-handler \
  --zip-file fileb://target/user-service-1.0.0-lambda.jar
```

### 4. Probar Lambda

```bash
aws lambda invoke \
  --function-name user-service-handler \
  --payload file://test-event.json \
  response.json

cat response.json
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

### Autenticación JWT

- Utiliza AWS Cognito para emitir JWT
- Spring Security valida automáticamente los tokens
- Todos los endpoints excepto `/api/users/register` y `/api/users/login` requieren autenticación

### CORS Configuration

```
Allowed Origins: http://localhost:3000, https://yourdomain.com
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
```

### Rate Limiting (Opcional)

```
Implementar en futuras versiones con Redis
```

## 🐛 Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| MongoDB Connection Refused | URI incorrecta o IP no whitelisted | Verificar connection string y whitelist en MongoDB Atlas |
| Invalid JWT Token | Token expirado o mal formado | Generar nuevo token desde Cognito |
| CORS Error | Origen no permitido | Agregar origen a lista de CORS permitidos |
| 403 Forbidden | Usuario no autorizado | Verificar permisos y propietario del recurso |
| Lambda Timeout | Operaciones lentas | Optimizar queries a MongoDB o aumentar timeout |

## 📊 Métricas y Monitoreo

### CloudWatch Logs

```bash
aws logs tail /aws/lambda/user-service-handler --follow
```

### Métricas Principales

- Latencia promedio de respuesta
- Número de errores 4xx y 5xx
- Tiempo de conexión a MongoDB
- Número de requests concurrentes

## 📚 Documentación Adicional

- [Spring Boot Security Documentation](https://spring.io/projects/spring-security)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [MongoDB Atlas Connection Guide](https://docs.atlas.mongodb.com/driver-connection/)
- [AWS Lambda Java Handler](https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html)

## 📝 Notas de Desarrollo

### Estructura de Carpetas

```
src/main/java/com/arep/twitter/userservice/
├── controller/
│   └── UserController.java
├── service/
│   └── UserService.java
├── repository/
│   └── UserRepository.java
├── model/
│   ├── User.java
│   ├── FollowRequest.java
│   └── UserDTO.java
├── config/
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── exception/
│   ├── UserNotFoundException.java
│   └── DuplicateUserException.java
└── UserServiceApplication.java
```

### Flujo de Autenticación

```
1. Usuario llena formulario de registro
2. Frontend envía POST /api/users/register
3. User Service valida y crea usuario en MongoDB
4. User Service crea User Pool entry en Cognito
5. Cognito retorna JWT token
6. Frontend almacena token en localStorage
7. Siguientes requests incluyen token en header Authorization
```

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Estado:** En Producción  
**Escuela Colombiana de Ingeniería Julio Garavito** - AREP
