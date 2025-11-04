# 🐦 Twitter Clone - Microservicios en AWS Lambda

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900.svg)](https://aws.amazon.com/lambda/)
[![AWS Cognito](https://img.shields.io/badge/AWS-Cognito-FF9900.svg)](https://aws.amazon.com/cognito/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Red social estilo Twitter con posts de 140 caracteres, construida con arquitectura de microservicios independientes desplegados en AWS Lambda con autenticación JWT via AWS Cognito.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Autores](#-autores)
- [Inicio Rápido (60 segundos)](#-inicio-rápido-60-segundos)
- [Características Principales](#-características-principales)
- [Lo Mejor de Este Proyecto](#-lo-mejor-de-este-proyecto)
- [Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Guía de Inicio Rápido](#-guía-de-inicio-rápido)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Seguridad](#-seguridad)
- [Documentación Detallada por Servicio](#-documentación-detallada-por-servicio)
- [Testing](#-testing)
- [Despliegue en AWS](#-despliegue-en-aws)
- [Video Demostración](#-video-demostración)
- [Checklist de Requerimientos](#-checklist-de-requerimientos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Preguntas Frecuentes](#-preguntas-frecuentes)
- [Referencias](#-referencias-y-documentación)
- [Licencia](#-licencia)

---

## 📋 Descripción del Proyecto

Este proyecto implementa una red social tipo Twitter siguiendo una arquitectura moderna de **microservicios**, desarrollada como parte del curso **AREP (Arquitecturas Empresariales)** de la **Escuela Colombiana de Ingeniería Julio Garavito**.

### ¿Qué es este proyecto?

Una red social tipo Twitter implementada con:
- **Backend:** 3 microservicios independientes en Java Spring Boot
- **Frontend:** Aplicación web moderna en React
- **Cloud:** Infraestructura completamente serverless en AWS (Lambda, API Gateway, Cognito, S3)
- **Base de datos:** MongoDB Atlas

### Enunciado del Proyecto

El proyecto fue construido siguiendo los siguientes requisitos:

1. ✅ Diseñar un API y crear un monolito Spring con tres entidades: Usuario, Stream (Timeline) y Posts
2. ✅ Crear aplicación JavaScript (React) para consumir el servicio
3. ✅ Desplegar la aplicación en S3 y hacerla disponible en internet
4. ✅ Agregar seguridad usando JWT con AWS Cognito
5. ✅ Separar el monolito en tres microservicios independientes
6. ✅ Desplegar los servicios en AWS Lambda
7. ✅ Entregar código en GitHub, reporte de arquitectura, pruebas, y demostración en video

---

## 👥 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/diegcard">
        <img src="https://github.com/diegcard.png" width="100px;" alt="Diego Cárdenas"/><br />
        <sub><b>Diego Cárdenas</b></sub>
      </a><br />
      <sub>Backend & Cloud Infrastructure</sub>
    </td>
    <td align="center">
      <a href="https://github.com/LIZVALMU">
        <img src="https://github.com/LIZVALMU.png" width="100px;" alt="Alison Valderrama"/><br />
        <sub><b>Alison Valderrama</b></sub>
      </a><br />
      <sub>Frontend & UI/UX</sub>
    </td>
  </tr>
</table>

**Institución:** Escuela Colombiana de Ingeniería Julio Garavito  
**Materia:** AREP - Arquitecturas Empresariales  
**Profesor Asesor:** Luis Daniel Benavides  
**Fecha:** Noviembre 2025

---

## ⚡ Inicio Rápido (60 segundos)

### ¿Por dónde empiezo?

**Si eres un evaluador o profesor:**
1. ✅ Lee este README 
2. ✅ Mira el [video demostrativo](https://youtu.be/s0Ic2EwLqkU)
4. ✅ Explora los [screenshots](#-capturas-de-pantalla)

**Si eres desarrollador:**
1. ✅ Entiende la [arquitectura](#️-arquitectura-del-sistema)
2. ✅ Ve a la documentación de tu área:
   - 👥 Backend Users → [user-service/README.md](./user-service/README.md)
   - 📝 Backend Posts → [post-service/README.md](./post-service/README.md)
   - 🌊 Backend Timeline → [stream-service/README.md](./stream-service/README.md)
   - ⚛️ Frontend → [frontend/README.md](./frontend/README.md)
3. ✅ Sigue la [Guía de Instalación Local](#-guía-de-inicio-rápido)

**Si eres DevOps/Cloud:**
1. ✅ Revisa la [arquitectura en AWS](#️-arquitectura-del-sistema)
3. ✅ Revisa los templates en `aws-config-templates/`

---

## ✨ Características Principales

### Funcionalidad de Usuario

- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión con AWS Cognito
- ✅ Autenticación vía OAuth 2.0
- ✅ Gestión de perfiles
- ✅ Sistema de seguir/dejar de seguir usuarios

### Funcionalidad de Posts

- ✅ Crear posts de máximo 140 caracteres
- ✅ Visualizar posts individuales
- ✅ Sistema de likes
- ✅ Sistema de comentarios
- ✅ Historial de posts por usuario

### Funcionalidad de Timeline

- ✅ Timeline global (todos los posts en orden cronológico inverso)
- ✅ Timeline personal (posts de usuarios seguidos)
- ✅ Búsqueda y filtrado
- ✅ Carga eficiente de datos

### Infraestructura Técnica

- ✅ Arquitectura serverless completamente en AWS
- ✅ Microservicios independientes y escalables
- ✅ Base de datos NoSQL (MongoDB Atlas)
- ✅ Interfaz moderna con React 18
- ✅ Autenticación segura con JWT
- ✅ Desplegado en S3 + CloudFront

---

## 🌟 Lo Mejor de Este Proyecto

### ✨ Microservicios Independientes

- **User Service** - Gestión completa de usuarios y autenticación
- **Post Service** - Creación de posts, comentarios y sistema de likes
- **Stream Service** - Timeline global, búsqueda y trending topics

Cada servicio es completamente independiente, escalable y desplegable por separado.

### 🔐 Seguridad Moderna

- **JWT Tokens** - Autenticación basada en tokens seguros
- **AWS Cognito OAuth 2.0** - Proveedores de identidad configurables
- **Spring Security** - Framework de seguridad enterprise-grade
- **CORS Configurado** - Protección contra ataques cross-origin

### ☁️ Infraestructura Cloud Escalable

- **AWS Lambda** - Funciones serverless con auto-scaling
- **API Gateway** - Endpoints REST profesionales y seguros
- **CloudFront** - CDN global para baja latencia
- **S3** - Hosting estático de alta disponibilidad
- **MongoDB Atlas** - Base de datos NoSQL distribuida

### ⚡ Stack Tecnológico Moderno

- **Java 17 + Spring Boot 3.2.0** - Backend robusto y profesional
- **React 18.2.0 + Vite** - Frontend ultra-rápido y reactivo
- **Node.js + Express** - Proxy OAuth y servidor de desarrollo
- **Docker-ready** - Contenedores listos para producción

---

## 🏗️ Arquitectura del Sistema

### Diagrama General

```
┌──────────────────────────────────────────────────────────────────────┐
│                    👥 USUARIOS FINALES                               │
│                  (Navegadores Web, Móviles)                          │
└────────────────────────┬─────────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  ☁️ AWS CLOUDFRONT (CDN)                             │
│  • Distribución Global de Contenido                                  │
│  • Certificado SSL/TLS                                               │
│  • Caché en Edge Locations                                           │
└────────────┬──────────────────────────────┬─────────────────────────┘
             │                              │
      ┌──────▼────────┐            ┌───────▼──────────┐
      │  📦 S3        │            │  🖥️ EXPRESS     │
      │  Website      │            │  OAuth Proxy    │
      │  Hosting      │            │  (Port 3000)    │
      └───────────────┘            └────────┬────────┘
                                            │ REST API
                                            ▼
        ┌────────────────────────────────────────────────────┐
        │    🌐 AWS API GATEWAY (REST)                       │
        │     • Regional Endpoint                            │
        │     • Lambda Proxy Integration                     │
        │     • CORS Enabled                                 │
        │  URL: https://abc123xyz.execute-api.us-east-1...  │
        └─┬──────────────────┬──────────────────┬────────────┘
          │                  │                  │
    ┌─────▼──────┐    ┌──────▼────┐    ┌───────▼──────┐
    │  /user/*   │    │ /post/*   │    │ /stream/*    │
    └─────┬──────┘    └──────┬────┘    └───────┬──────┘
          │                  │                  │
    ┌─────▼────────┐  ┌──────▼──────┐  ┌───────▼────────┐
    │ ⚡ USER      │  │ ⚡ POST    │  │ ⚡ STREAM    │
    │ SERVICE      │  │ SERVICE    │  │ SERVICE      │
    │              │  │            │  │              │
    │ Lambda       │  │ Lambda     │  │ Lambda       │
    │ Java 17      │  │ Java 17    │  │ Java 17      │
    │ Spring Boot  │  │ Spring Boot│  │ Spring Boot  │
    │ 1024 MB      │  │ 1024 MB    │  │ 1024 MB      │
    │ 30s Timeout  │  │ 30s TO     │  │ 30s Timeout  │
    └─────┬────────┘  └──────┬─────┘  └───────┬───────┘
          │                  │                 │
          └──────────────────┼─────────────────┘
                             │
        ┌────────────────────┴────────────────┐
        │                                     │
    ┌───▼──────────────┐        ┌────────────▼──┐
    │  🍃 MONGODB      │        │  🔐 AWS       │
    │  ATLAS           │        │  COGNITO      │
    │                  │        │               │
    │ • Users DB       │        │ • User Pool   │
    │ • Posts DB       │        │ • JWT Tokens  │
    │ • Comments DB    │        │ • OAuth 2.0   │
    │ • Timeline       │        │               │
    └──────────────────┘        └───────────────┘
```

### Componentes Principales

| Componente | Descripción | Tecnología |
|-----------|-------------|-----------|
| **Frontend** | Interfaz de usuario | React 18, Vite, Express |
| **User Service** | Gestión de usuarios y autenticación | Java 17, Spring Boot, Lambda |
| **Post Service** | Creación y gestión de posts | Java 17, Spring Boot, Lambda |
| **Stream Service** | Timeline global y búsqueda | Java 17, Spring Boot, Lambda |
| **Base de Datos** | Persistencia de datos | MongoDB Atlas |
| **Autenticación** | Gestión de identidad | AWS Cognito |
| **CDN** | Distribución de contenido | AWS CloudFront + S3 |

---

## 📸 Capturas de Pantalla

### Página Principal
![Home Page](./img/index.png)
*Página inicial de bienvenida de la aplicación*

### Autenticación con AWS Cognito
![Login Cognito](./img/login-cognito.png)
*Pantalla de login integrada con AWS Cognito usando OAuth 2.0*

### Timeline Global
![Timeline Page](./img/time-line-page.png)
*Feed de posts mostrando todos los posts en orden cronológico inverso con opciones de interacción*

### Crear Post
![Initial Page](./img/initial-page.png)
*Interfaz para crear nuevos posts con validación de 140 caracteres*

### Perfil de Usuario
![Profile Page](./img/profile-page.png)
*Perfil de usuario mostrando información personal y posts del usuario*

### Sistema de Comentarios
![Comments Page](./img/comments-page.png)
*Sección de comentarios con posibilidad de agregar nuevos comentarios a los posts*

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos

- **Java 17** o superior
- **Maven 3.8.0** o superior
- **Node.js 16+** y npm
- **Git** para control de versiones
- **Cuenta AWS** (con acceso a Lambda, API Gateway, Cognito)
- **MongoDB Atlas** (base de datos - cuenta gratuita disponible)

### Instalación Local

#### 1. Clonar el Repositorio

```bash
git clone https://github.com/diegcard-arep/arep-microservicios.git
cd arep-taller-7
```

#### 2. Instalar y Ejecutar User Service

```bash
cd user-service
mvn clean install
mvn spring-boot:run

# Accesible en: http://localhost:8081
```

#### 3. Instalar y Ejecutar Post Service (Nueva Terminal)

```bash
cd post-service
mvn clean install
mvn spring-boot:run

# Accesible en: http://localhost:8082
```

#### 4. Instalar y Ejecutar Stream Service (Nueva Terminal)

```bash
cd stream-service
mvn clean install
mvn spring-boot:run

# Accesible en: http://localhost:8083
```

#### 5. Instalar y Ejecutar Frontend (Nueva Terminal)

```bash
cd frontend
npm install

# Opción 1: Desarrollo con hot reload
npm run dev:all

# Opción 2: Solo servidor Express
npm run server

# Opción 3: Build para producción
npm run build
npm start

# Accesible en: http://localhost:3000
```

---

## 🔧 Configuración

### Variables de Entorno - Servicios Java

Crear archivo `.env` en la raíz de cada servicio o en el archivo `application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/twitter?retryWrites=true&w=majority
spring.data.mongodb.database=twitter

# AWS Configuration
aws.cognito.userPoolId=us-east-1_XXXXXXXXX
aws.cognito.clientId=your_client_id
aws.region=us-east-1

# Server Configuration
server.port=8081  # Cambiar para cada servicio (8082, 8083)
```

### Variables de Entorno - Frontend

Crear archivo `.env` en `frontend/`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AUTH_URL=http://localhost:3000/auth

# AWS Cognito Configuration
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your_client_id
VITE_COGNITO_REDIRECT_URI=http://localhost:3000/callback

# Services URLs (for local development)
VITE_USER_SERVICE_URL=http://localhost:8081
VITE_POST_SERVICE_URL=http://localhost:8082
VITE_STREAM_SERVICE_URL=http://localhost:8083

# Environment
NODE_ENV=development
```

### Configuración de AWS Cognito

1. Crear User Pool en AWS Cognito
2. Crear App Client con:
   - Callback URLs: `http://localhost:3000/callback`, `https://yourdomain.com/callback`
   - Sign out URLs: `http://localhost:3000`, `https://yourdomain.com`
   - Allowed OAuth Flows: Authorization code flow
   - Allowed OAuth Scopes: openid, profile, email

---

## 📦 Estructura del Proyecto

```
arep-taller-7/
│
├── 📂 user-service/                    # Microservicio de Usuarios
│   ├── src/main/java/com/arep/twitter/userservice/
│   │   ├── UserController.java         # Endpoints REST
│   │   ├── UserService.java            # Lógica de negocio
│   │   ├── UserRepository.java         # Acceso a datos
│   │   ├── User.java                   # Entidad de Usuario
│   │   └── SecurityConfig.java         # Configuración de seguridad
│   ├── pom.xml                         # Dependencias Maven
│   └── README.md                       # Documentación específica
│
├── 📂 post-service/                    # Microservicio de Posts
│   ├── src/main/java/com/arep/twitter/postservice/
│   │   ├── PostController.java         # Endpoints REST
│   │   ├── PostService.java            # Lógica de negocio
│   │   ├── PostRepository.java         # Acceso a datos
│   │   ├── Post.java                   # Entidad de Post
│   │   ├── Comment.java                # Entidad de Comentario
│   │   └── SecurityConfig.java         # Configuración de seguridad
│   ├── pom.xml                         # Dependencias Maven
│   └── README.md                       # Documentación específica
│
├── 📂 stream-service/                  # Microservicio de Timeline
│   ├── src/main/java/com/arep/twitter/streamservice/
│   │   ├── StreamController.java       # Endpoints REST
│   │   ├── StreamService.java          # Lógica de negocio
│   │   ├── TimelineDTO.java            # DTO para timeline
│   │   └── SecurityConfig.java         # Configuración de seguridad
│   ├── pom.xml                         # Dependencias Maven
│   └── README.md                       # Documentación específica
│
├── 📂 frontend/                        # Aplicación React
│   ├── src/
│   │   ├── components/                 # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── Comments.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                      # Páginas principales
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Timeline.jsx
│   │   ├── services/                   # Servicios API
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── postService.js
│   │   │   └── timelineService.js
│   │   ├── contexts/                   # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx                     # Componente principal
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Estilos globales
│   ├── server.js                       # Servidor Express (OAuth proxy)
│   ├── package.json
│   ├── vite.config.js
│   └── README.md                       # Documentación específica
│
├── 📂 aws-config-templates/            # Configuración para AWS
│   ├── lambda-config-example.json      # Template de función Lambda
│   ├── lambda-env-user-service.json    # Variables de entorno
│   ├── lambda-env-post-service.json
│   ├── lambda-env-stream-service.json
│   └── lambda-test-events/             # Eventos de prueba
│       ├── user-service-get-users.json
│       ├── post-service-create-post.json
│       └── ...
│
├── 📂 scripts/                         # Scripts de despliegue
│   └── deploy.sh                       # Script de despliegue
│
├── ARQUITECTURA_DIAGRAMA.md            # Diagrama detallado
├── README.md                           # Este archivo
└── LICENSE                             # Licencia MIT
```

---

## 🔐 Seguridad

### Autenticación y Autorización

El proyecto implementa seguridad en múltiples capas:

#### 1. **Autenticación con AWS Cognito**
- Los usuarios se registran e inician sesión a través de AWS Cognito
- OAuth 2.0 con proveedores de identidad configurables
- Multi-factor authentication (opcional)

#### 2. **JWT (JSON Web Tokens)**
- Tokens JWT firmados por Cognito
- Validación de tokens en cada request protegido
- Spring Security con `@EnableOAuth2ResourceServer`

#### 3. **Control de Acceso**
```javascript
// Encabezado requerido para endpoints protegidos:
Authorization: Bearer <JWT_TOKEN>
```

#### 4. **Configuración CORS**
- Solo se aceptan requests desde dominio autorizado
- Métodos HTTP permitidos: GET, POST, PUT, DELETE, OPTIONS
- Headers personalizados permitidos

### Endpoints Protegidos

| Servicio | Endpoint | Acceso |
|----------|----------|--------|
| **User** | GET /users/{id} | ✅ Autenticado |
| **User** | PUT /users/{id} | ✅ Solo propietario |
| **Post** | POST /posts | ✅ Autenticado |
| **Post** | GET /posts/{id} | ✅ Público |
| **Stream** | GET /timeline | ✅ Autenticado |

### Endpoints Públicos

| Servicio | Endpoint |
|----------|----------|
| **Auth** | POST /auth/register |
| **Auth** | POST /auth/login |
| **Post** | GET /posts/{id} |

---

## 📚 Documentación Detallada por Servicio

### 🧑 User Service - Gestión de Usuarios

**Descripción**: Microservicio encargado de la gestión de usuarios, autenticación y perfiles.

**Ver documentación completa**: [user-service/README.md](./user-service/README.md)

**Responsabilidades**:
- Registro de nuevos usuarios
- Validación de credenciales
- Gestión de perfiles
- Sistema de seguir/dejar de seguir

**Endpoints principales**:
```
GET    /users/{id}                    # Obtener usuario
POST   /users/register                # Registrar nuevo usuario
PUT    /users/{id}                    # Actualizar perfil
POST   /users/{id}/follow/{targetId}  # Seguir usuario
DELETE /users/{id}/follow/{targetId}  # Dejar de seguir
GET    /users/cognito/{cognitoId}     # Obtener por Cognito ID
```

---

### 📝 Post Service - Gestión de Posts

**Descripción**: Microservicio encargado de la creación y gestión de posts.

**Ver documentación completa**: [post-service/README.md](./post-service/README.md)

**Responsabilidades**:
- Crear posts de máximo 140 caracteres
- Gestionar likes en posts
- Gestionar comentarios
- Validar integridad de datos

**Endpoints principales**:
```
POST   /posts                         # Crear post
GET    /posts/{id}                    # Obtener post
GET    /posts/user/{userId}           # Posts de usuario
POST   /posts/{id}/like               # Dar like
DELETE /posts/{id}/like               # Remover like
POST   /posts/{id}/comments           # Agregar comentario
GET    /posts/{id}/comments           # Obtener comentarios
```

---

### 📊 Stream Service - Timeline

**Descripción**: Microservicio encargado del timeline global y búsqueda.

**Ver documentación completa**: [stream-service/README.md](./stream-service/README.md)

**Responsabilidades**:
- Generar timeline global
- Generar timeline personalizado
- Agregar datos de múltiples servicios
- Búsqueda y filtrado

**Endpoints principales**:
```
GET    /timeline                      # Timeline global
GET    /timeline/user/{userId}        # Timeline personal
GET    /search?q=keyword              # Búsqueda de posts
GET    /trending                      # Tendencias
```

---

### 🎨 Frontend React - Interfaz de Usuario

**Descripción**: Aplicación React moderna con interfaz responsive.

**Ver documentación completa**: [frontend/README.md](./frontend/README.md)

**Características**:
- Diseño responsive (mobile, tablet, desktop)
- Autenticación OAuth con Cognito
- Timeline con auto-scroll
- Creación de posts con validación
- Perfiles de usuario interactivos

---

## 🧪 Testing

### Pruebas Unitarias

```bash
# Ejecutar pruebas del User Service
cd user-service
mvn test

# Ejecutar pruebas del Post Service
cd post-service
mvn test

# Ejecutar pruebas del Stream Service
cd stream-service
mvn test
```

### Pruebas de Integración

```bash
# Ejecutar todas las pruebas
mvn verify

# Ejecutar test específico
mvn test -Dtest=UserControllerTest
```

### Pruebas de Lambda

Los archivos de prueba de Lambda están en `aws-config-templates/lambda-test-events/`:

```bash
# Probar User Service
aws lambda invoke \
  --function-name user-service-handler \
  --payload file://aws-config-templates/lambda-test-events/user-service-get-users.json \
  response.json

# Probar Post Service
aws lambda invoke \
  --function-name post-service-handler \
  --payload file://aws-config-templates/lambda-test-events/post-service-create-post.json \
  response.json

# Probar Stream Service
aws lambda invoke \
  --function-name stream-service-handler \
  --payload file://aws-config-templates/lambda-test-events/stream-service-get-timeline.json \
  response.json
```

### Ejemplo de Caso de Prueba

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8081/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'

# 2. Crear post
curl -X POST http://localhost:8082/posts \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content":"Este es mi primer post!","userId":"user123"}'

# 3. Obtener timeline
curl -X GET http://localhost:8083/timeline \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🌐 Despliegue en AWS

### 1. Construir JAR para Lambda

```bash
# User Service
cd user-service
mvn clean package

# Resultado: target/user-service-1.0.0-lambda.jar
```

### 2. Crear Rol IAM para Lambda

```bash
aws iam create-role --role-name lambda-twitter-role \
  --assume-role-policy-document file://trust-policy.json

aws iam attach-role-policy --role-name lambda-twitter-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### 3. Crear Función Lambda

```bash
aws lambda create-function \
  --function-name user-service-handler \
  --runtime java17 \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-twitter-role \
  --handler com.amazonaws.serverless.proxy.spring.StreamLambdaHandler::handleRequest \
  --zip-file fileb://user-service-1.0.0-lambda.jar \
  --timeout 30 \
  --memory-size 1024 \
  --environment Variables="{MONGO_URI=mongodb+srv://...,AWS_REGION=us-east-1}"
```

### 4. Crear API Gateway

```bash
aws apigateway create-rest-api --name twitter-api --description "Twitter Clone API"

# Configurar rutas y métodos
# Integrar con Lambda functions
```

### 5. Desplegar Frontend en S3

```bash
cd frontend
npm run build

# Crear bucket S3
aws s3 mb s3://twitter-clone-frontend

# Subir archivos
aws s3 sync dist/ s3://twitter-clone-frontend --delete

# Configurar website hosting
aws s3 website s3://twitter-clone-frontend \
  --index-document index.html \
  --error-document index.html
```

### 6. Configurar CloudFront

```bash
aws cloudfront create-distribution --distribution-config file://cf-config.json
```

---

## 🎬 Video Demostración

<div align="center">
  <a href="https://youtu.be/s0Ic2EwLqkU" target="_blank">
    <img src="https://img.youtube.com/vi/s0Ic2EwLqkU/0.jpg" alt="Ver Video de Demostración" style="width: 400px; cursor: pointer;">
  </a>
</div>

**[Ver Video de Demostración Completo](https://youtu.be/s0Ic2EwLqkU)**

El video de demostración muestra:

✅ **Autenticación**
- Pantalla de registro con AWS Cognito
- Validación de credenciales
- Inicio de sesión exitoso

✅ **Creación de Posts**
- Crear post de 140 caracteres
- Validación de límite de caracteres
- Post aparece inmediatamente en timeline

✅ **Timeline Global**
- Visualización de todos los posts
- Orden cronológico inverso
- Información del autor

✅ **Interacciones**
- Sistema de likes funcionando
- Comentarios en posts
- Actualización en tiempo real

✅ **Perfiles de Usuario**
- Visualizar información del perfil
- Editar información personal
- Ver posts del usuario

✅ **Despliegue en AWS**
- Lambda functions funcionando
- API Gateway respondiendo requests
- Frontend disponible en CloudFront

---

## 📋 Checklist de Requerimientos

| Requisito | Estado | Referencia |
|-----------|--------|-----------|
| API y Monolito Spring | ✅ Completado | Ver servicios Java |
| Aplicación React | ✅ Completado | [frontend/](./frontend/) |
| Despliegue en S3 | ✅ Completado | CloudFront + S3 |
| Seguridad JWT + Cognito | ✅ Completado | SecurityConfig en servicios |
| Tres Microservicios en Lambda | ✅ Completado | User, Post, Stream Services |
| Código en GitHub | ✅ Completado | [Ver repositorio](https://github.com/diegcard-arep/arep-microservicios) |
| Reporte de Arquitectura | ✅ Completado | [ARQUITECTURA_DIAGRAMA.md](./ARQUITECTURA_DIAGRAMA.md) |
| Pruebas Documentadas | ✅ Completado | [aws-config-templates/lambda-test-events/](./aws-config-templates/lambda-test-events/) |
| Video Funcionando | ✅ Completado | [Ver en YouTube](https://youtu.be/s0Ic2EwLqkU) |

---

## 📚 Stack Tecnológico

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.0** - Framework web
- **Spring Data MongoDB** - ORM para MongoDB
- **Spring Security** - Autenticación y autorización
- **Spring OAuth 2 Resource Server** - Validación JWT
- **AWS Serverless Java Container** - Adaptador para Lambda

### Frontend
- **React 18.2.0** - Framework UI
- **Vite 5.0.8** - Build tool ultra-rápido
- **React Router 6.20.0** - Enrutamiento
- **Axios 1.6.2** - Cliente HTTP
- **Express 4.21.1** - Servidor Node.js

### Infraestructura
- **AWS Lambda** - Funciones sin servidor
- **AWS API Gateway** - API REST
- **AWS S3** - Almacenamiento estático
- **AWS CloudFront** - CDN global
- **AWS Cognito** - Gestión de identidad
- **MongoDB Atlas** - Base de datos NoSQL

---

## 📖 Referencias y Documentación

- [Spring Boot Official Docs](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [AWS Cognito User Guide](https://docs.aws.amazon.com/cognito/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [OpenID Connect Provider Configuration](https://openid.net/specs/openid-connect-core-1_0.html)

---

## 🤝 Contribuciones

Este es un proyecto académico. Para preguntas o sugerencias, por favor crear un issue en el repositorio.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](./LICENSE) para más detalles.

---

## 📞 Soporte y Contacto

Para preguntas sobre el proyecto:
- Crear un issue en el [repositorio de GitHub](https://github.com/diegcard-arep/arep-microservicios)
- Contactar a los autores a través del repositorio

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0  
**Escuela Colombiana de Ingeniería Julio Garavito** - AREP
