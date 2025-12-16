// JWT Utility Functions for Authentication

/**
 * Get JWT Secret from environment variable
 * Falls back to a default key if not set (NOT recommended for production)
 */
const getJWTSecret = () => {
    const secret = import.meta.env.VITE_JWT_SECRET;
    if (!secret) {
        console.warn('⚠️ VITE_JWT_SECRET not found in .env file. Using default key (NOT SECURE)');
        return 'default-insecure-key-change-this';
    }
    return secret;
};

/**
 * Token Expiration Options:
 * - '1h' = 1 hour
 * - '24h' = 24 hours
 * - '7d' = 7 days
 * - '30d' = 30 days
 * - '1y' = 1 year
 * - 'permanent' = Never expires (set to year 2099 - DEFAULT)
 */

/**
 * Generate a mock JWT token
 * In production, this would be done by your backend server
 * @param {Object} userData - User data to encode in token
 * @param {String} expiresIn - Token expiration time (default: 'permanent')
 */
export const generateToken = (userData, expiresIn = 'permanent') => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);

    // Calculate expiration based on expiresIn parameter
    let exp;
    if (expiresIn === 'permanent') {
        // Set expiration to year 2099 (essentially permanent)
        exp = Math.floor(new Date('2099-12-31').getTime() / 1000);
        console.log('🔐 Token will never expire (valid until 2099)');
    } else {
        // Parse expiration time
        const expirationMap = {
            '1h': 1 * 60 * 60,           // 1 hour
            '24h': 24 * 60 * 60,         // 24 hours
            '7d': 7 * 24 * 60 * 60,      // 7 days
            '30d': 30 * 24 * 60 * 60,    // 30 days
            '1y': 365 * 24 * 60 * 60     // 1 year
        };

        const seconds = expirationMap[expiresIn] || expirationMap['24h'];
        exp = now + seconds;

        const expirationDate = new Date(exp * 1000);
        console.log(`🔐 Token will expire on: ${expirationDate.toLocaleString()}`);
    }

    const payload = {
        email: userData.email,
        role: userData.role,
        name: userData.name,
        iat: now, // Issued at
        exp: exp  // Expires at
    };

    // Base64 encode header and payload
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    // Get secret key from environment variable
    const secretKey = getJWTSecret();

    // Create a signature using the secret key
    // NOTE: This is still a mock implementation. In production, use a proper JWT library
    // like 'jsonwebtoken' on the backend with HMAC-SHA256 signing
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secretKey}`);

    // Return the complete JWT token
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Decode and verify JWT token
 * Returns the payload if valid, null if invalid or expired
 */
export const verifyToken = (token) => {
    if (!token) return null;

    try {
        // Split the token into parts
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Decode the payload
        const payload = JSON.parse(atob(parts[1]));

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
            console.log('Token expired');
            return null;
        }

        return payload;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};

/**
 * Get user data from token
 */
export const getUserFromToken = () => {
    const token = localStorage.getItem('authToken');
    return verifyToken(token);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const payload = verifyToken(token);
    return payload !== null;
};

/**
 * Get user role from token
 */
export const getUserRole = () => {
    const user = getUserFromToken();
    return user ? user.role : null;
};

/**
 * Logout user by removing token
 */
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
};

/**
 * Store token in localStorage
 */
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

/**
 * Get token from localStorage
 */
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

/**
 * Refresh token (mock implementation)
 * In production, this would call your backend to get a new token
 * @param {String} expiresIn - New token expiration time
 */
export const refreshToken = (expiresIn = 'permanent') => {
    const user = getUserFromToken();
    if (!user) return null;

    // Generate a new token with updated expiration
    return generateToken({
        email: user.email,
        role: user.role,
        name: user.name
    }, expiresIn);
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        return {
            header: JSON.parse(atob(parts[0])),
            payload: JSON.parse(atob(parts[1]))
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Mock login function (simulates backend authentication)
 * Now uses userStore for dynamic user management
 * @param {String} email - User email
 * @param {String} password - User password
 * @param {String} role - User role
 * @param {String} expiresIn - Token expiration time (default: 'permanent')
 */
export const mockLogin = async (email, password, role, expiresIn = 'permanent') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Import userStore
    const { authenticateUser } = await import('./userStore');

    try {
        // Authenticate user using userStore
        const user = authenticateUser(email, password, role);

        // Generate JWT token with specified expiration
        const token = generateToken({
            email: user.email,
            role: user.role,
            name: user.name
        }, expiresIn);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        };
    } catch (error) {
        throw new Error(error.message || 'Invalid credentials');
    }
};

export default {
    generateToken,
    verifyToken,
    getUserFromToken,
    isAuthenticated,
    getUserRole,
    logout,
    setAuthToken,
    getAuthToken,
    refreshToken,
    decodeToken,
    mockLogin
};
