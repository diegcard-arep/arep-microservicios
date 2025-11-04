import express from 'express';
import session from 'express-session';
import { Issuer, generators } from 'openid-client';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración
const PORT = process.env.PORT || 3000;
const COGNITO_DOMAIN = 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_3UE2M9esT';
const CLIENT_ID = '60eebpfhovmh3is752k16hhngt';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '3ddaqhndbi7tl87j0rj7t1nn7s4asl67vg08u2bak15011sdh2l';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/callback';
const LOGOUT_URI = process.env.LOGOUT_URI || 'http://localhost:3000';

// URLs de los microservicios
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8081';
const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://localhost:8082';
const STREAM_SERVICE_URL = process.env.STREAM_SERVICE_URL || 'http://localhost:8083';

let client;

// Inicializar OpenID Client
async function initializeClient() {
    try {
        const issuer = await Issuer.discover(COGNITO_DOMAIN);
        client = new issuer.Client({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uris: [REDIRECT_URI],
            response_types: ['code']
        });
        console.log('OpenID Client initialized successfully');
    } catch (error) {
        console.error('Error initializing OpenID Client:', error);
    }
}

initializeClient().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para desarrollo
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (origin.includes('localhost:5173') || origin.includes('localhost:3000'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'arep-twitter-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax'
    }
}));

// Middleware de autenticación
const checkAuth = (req, res, next) => {
    if (!req.session.userInfo || !req.session.tokenSet || !req.session.accessToken) {
        req.isAuthenticated = false;
        req.userInfo = null;
        req.accessToken = null;
        req.currentUser = null;
    } else {
        req.isAuthenticated = true;
        req.userInfo = req.session.userInfo;
        req.accessToken = req.session.accessToken;
        req.currentUser = req.session.currentUser;
    }
    next();
};

// Middleware para requerir autenticación
const requireAuth = (req, res, next) => {
    if (!req.session.userInfo || !req.session.tokenSet || !req.session.accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userInfo = req.session.userInfo;
    req.accessToken = req.session.accessToken;
    req.currentUser = req.session.currentUser;
    next();
};

// Helper para obtener current user (lazy loading)
async function getCurrentUser(req) {
    if (req.currentUser) {
        return req.currentUser;
    }
    
    try {
        const response = await axios.get(
            `${USER_SERVICE_URL}/api/users/cognito/${req.userInfo.sub}`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );
        req.session.currentUser = response.data;
        return response.data;
    } catch (error) {
        console.error('Error getting current user:', error.message);
        throw error;
    }
}

// Helper para obtener ruta de URL
function getPathFromURL(urlString) {
    try {
        const url = new URL(urlString);
        return url.pathname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

// API Routes

// Auth status
app.get('/api/auth/status', checkAuth, async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.json({
                isAuthenticated: false,
                userInfo: null,
                currentUser: null
            });
        }

        let currentUser = null;
        try {
            currentUser = await getCurrentUser(req);
        } catch (error) {
            // User not found in database, but authenticated in Cognito
            if (error.response?.status !== 404) {
                throw error;
            }
        }

        res.json({
            isAuthenticated: true,
            userInfo: req.userInfo,
            currentUser: currentUser
        });
    } catch (error) {
        console.error('Error checking auth status:', error);
        res.json({
            isAuthenticated: false,
            userInfo: null,
            currentUser: null
        });
    }
});

// Login
app.get('/api/auth/login', (req, res) => {
    if (!client) {
        console.error('OpenID Client not initialized yet. Please wait a few seconds and try again.');
        return res.status(503).json({ 
            error: 'Authentication service not initialized',
            message: 'Please wait a few seconds for the service to initialize and try again.'
        });
    }

    try {
        const nonce = generators.nonce();
        const state = generators.state();

        req.session.nonce = nonce;
        req.session.state = state;

        const authUrl = client.authorizationUrl({
            scope: 'openid email',
            state: state,
            nonce: nonce,
        });

        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating auth URL:', error);
        res.status(500).json({ error: 'Error initiating login' });
    }
});

// Callback de Cognito - Rutas múltiples para compatibilidad
const callbackPath = getPathFromURL(REDIRECT_URI);
const callbackHandler = async (req, res) => {
    try {
        if (!client) {
            return res.redirect('/?error=service_not_initialized');
        }

        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            REDIRECT_URI,
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state
            }
        );

        const userInfo = await client.userinfo(tokenSet.access_token);
        
        // Guardar en sesión
        req.session.userInfo = userInfo;
        req.session.tokenSet = tokenSet;
        req.session.accessToken = tokenSet.access_token;
        
        console.log('Login exitoso para:', userInfo.email);
        console.log('Cognito Sub:', userInfo.sub);

        // Verificar si el usuario ya existe en la base de datos
        try {
            const response = await axios.get(
                `${USER_SERVICE_URL}/api/users/cognito/${userInfo.sub}`,
                {
                    headers: { 'Authorization': `Bearer ${tokenSet.access_token}` }
                }
            );
            
            // Usuario existe, guardar en sesión y redirigir a home
            req.session.currentUser = response.data;
            console.log('Usuario encontrado en BD:', response.data.username);
            return res.redirect('/');
            
        } catch (error) {
            // Usuario no existe en BD, redirigir a registro
            if (error.response && error.response.status === 404) {
                console.log('Usuario nuevo, redirigiendo a registro');
                return res.redirect('/register');
            }
            
            // Otro error
            console.error('Error verificando usuario:', error.message);
            return res.redirect('/register');
        }
        
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/?error=authentication_failed');
    }
};

// Registrar la ruta de callback
if (callbackPath) {
    app.get(callbackPath, callbackHandler);
}
// También registrar /callback directamente para compatibilidad
app.get('/callback', callbackHandler);

// Logout
app.get('/api/auth/logout', (req, res) => {
    const idToken = req.session?.tokenSet?.id_token;

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }

        let logoutUrl;
        try {
            if (client && typeof client.endSessionUrl === 'function') {
                logoutUrl = client.endSessionUrl({
                    id_token_hint: idToken,
                    post_logout_redirect_uri: LOGOUT_URI
                });
            } else if (client && client.issuer && client.issuer.metadata && client.issuer.metadata.end_session_endpoint) {
                const endSessionEndpoint = client.issuer.metadata.end_session_endpoint;
                logoutUrl = `${endSessionEndpoint}?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
                if (idToken) logoutUrl += `&id_token_hint=${encodeURIComponent(idToken)}`;
            } else {
                logoutUrl = `https://gr2gli.auth.us-east-1.amazoncognito.com/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
                if (idToken) logoutUrl += `&id_token_hint=${encodeURIComponent(idToken)}`;
            }
        } catch (e) {
            console.error('Error constructing logout URL:', e);
            logoutUrl = `https://gr2gli.auth.us-east-1.amazoncognito.com/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
            if (idToken) logoutUrl += `&id_token_hint=${encodeURIComponent(idToken)}`;
        }

        res.redirect(logoutUrl);
    });
});

// User routes
app.get('/api/users/current', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);
        res.json(currentUser);
    } catch (error) {
        console.error('Error getting current user:', error);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Error getting user' });
    }
});

app.post('/api/users/register', requireAuth, async (req, res) => {
    try {
        const { username, bio } = req.body;
        
        console.log('Registrando usuario:', username);
        console.log('Cognito Sub:', req.userInfo.sub);
        console.log('Email:', req.userInfo.email);
        
        const response = await axios.post(
            `${USER_SERVICE_URL}/api/users/register`,
            {
                username: username,
                email: req.userInfo.email,
                cognitoSub: req.userInfo.sub,
                bio: bio || '',
                profileImageUrl: ''
            },
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        // Guardar usuario en sesión
        req.session.currentUser = response.data;
        console.log('Usuario registrado exitosamente:', response.data.username);

        res.json(response.data);
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error creating user account'
        });
    }
});

app.get('/api/users/username/:username', requireAuth, async (req, res) => {
    try {
        const response = await axios.get(
            `${USER_SERVICE_URL}/api/users/username/${req.params.username}`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error getting user by username:', error);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error getting user'
        });
    }
});

// Post routes
app.post('/api/posts', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);

        const response = await axios.post(
            `${POST_SERVICE_URL}/api/posts?userId=${currentUser.id}&username=${currentUser.username}`,
            { content: req.body.content },
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        console.log('Post creado exitosamente por:', currentUser.username);
        res.json(response.data);
    } catch (error) {
        console.error('Error creating post:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error creating post'
        });
    }
});

app.post('/api/posts/:id/like', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);

        await axios.post(
            `${POST_SERVICE_URL}/api/posts/${req.params.id}/like?userId=${currentUser.id}`,
            {},
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || 'Error liking post'
        });
    }
});

app.post('/api/posts/:id/unlike', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);

        await axios.post(
            `${POST_SERVICE_URL}/api/posts/${req.params.id}/unlike?userId=${currentUser.id}`,
            {},
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || 'Error unliking post'
        });
    }
});

app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);

        console.log('Adding comment to post:', req.params.id);
        console.log('Comment content:', req.body.content);
        console.log('User:', currentUser.username);

        const response = await axios.post(
            `${POST_SERVICE_URL}/api/posts/${req.params.id}/comments?userId=${currentUser.id}&username=${currentUser.username}`,
            { content: req.body.content },
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        console.log('Comment added successfully:', response.data);
        res.json({ success: true, comment: response.data });
    } catch (error) {
        console.error('Error adding comment:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || 'Error adding comment'
        });
    }
});

app.get('/api/posts/:id/comments', requireAuth, async (req, res) => {
    try {
        const response = await axios.get(
            `${POST_SERVICE_URL}/api/posts/${req.params.id}/comments`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json({ success: true, comments: response.data });
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || 'Error getting comments'
        });
    }
});

// Timeline routes
app.get('/api/timeline/personal', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 20;

        const response = await axios.get(
            `${STREAM_SERVICE_URL}/api/timeline/personal?userId=${currentUser.id}&page=${page}&size=${size}`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error loading personal timeline:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error loading timeline'
        });
    }
});

app.get('/api/timeline/global', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 20;

        const response = await axios.get(
            `${STREAM_SERVICE_URL}/api/timeline/global?userId=${currentUser.id}&page=${page}&size=${size}`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error loading global timeline:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error loading timeline'
        });
    }
});

app.get('/api/timeline/user/:userId', requireAuth, async (req, res) => {
    try {
        const currentUser = await getCurrentUser(req);
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 20;

        const response = await axios.get(
            `${STREAM_SERVICE_URL}/api/timeline/user/${req.params.userId}?currentUserId=${currentUser.id}&page=${page}&size=${size}`,
            {
                headers: { 'Authorization': `Bearer ${req.accessToken}` }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error loading user timeline:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Error loading timeline'
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', service: 'frontend' });
});

// Serve React app
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    // Serve static files from dist
    app.use(express.static(join(__dirname, 'dist')));

    // Serve index.html for all non-API routes
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            try {
                const html = readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8');
                res.send(html);
            } catch (error) {
                res.status(500).send('Error serving React app');
            }
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    });
} else {
    // In development, redirect to Vite dev server
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.redirect(`http://localhost:5173${req.path}`);
        }
    });
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!isProduction) {
        console.log(`React dev server should be running on http://localhost:5173`);
    }
});

