


const getJWTSecret = () => {
    const secret = import.meta.env.VITE_JWT_SECRET;
    if (!secret) {
        console.warn('⚠️ VITE_JWT_SECRET not found in .env file. Using default key (NOT SECURE)');
        return 'default-insecure-key-change-this';
    }
    return secret;
};




export const generateToken = (userData, expiresIn = 'permanent') => {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);

    
    let exp;
    if (expiresIn === 'permanent') {
        
        exp = Math.floor(new Date('2099-12-31').getTime() / 1000);
        console.log('🔐 Token will never expire (valid until 2099)');
    } else {
        
        const expirationMap = {
            '1h': 1 * 60 * 60,           
            '24h': 24 * 60 * 60,         
            '7d': 7 * 24 * 60 * 60,      
            '30d': 30 * 24 * 60 * 60,    
            '1y': 365 * 24 * 60 * 60     
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
        iat: now, 
        exp: exp  
    };

    
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    
    const secretKey = getJWTSecret();

    
    
    
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secretKey}`);

    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};


export const verifyToken = (token) => {
    if (!token) return null;

    try {
        
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        
        const payload = JSON.parse(atob(parts[1]));

        
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


export const getUserFromToken = () => {
    const token = localStorage.getItem('authToken');
    return verifyToken(token);
};


export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    const payload = verifyToken(token);
    return payload !== null;
};


export const getUserRole = () => {
    const user = getUserFromToken();
    return user ? user.role : null;
};


export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
};


export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};


export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};


export const refreshToken = (expiresIn = 'permanent') => {
    const user = getUserFromToken();
    if (!user) return null;

    
    return generateToken({
        email: user.email,
        role: user.role,
        name: user.name
    }, expiresIn);
};


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

export const login = async (email, password, role, expiresIn = 'permanent') => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const { authenticateUser } = await import('./userStore');

    try {
        
        const user = authenticateUser(email, password, role);

        
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
    login
};
