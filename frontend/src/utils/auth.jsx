// JWT Token Management
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'currentUser';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer before token expiry

// Get JWT token from localStorage
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Set JWT token in localStorage
export const setToken = (token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

// Remove JWT token from localStorage
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// Get current user data
export const getCurrentUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Set current user data
export const setCurrentUser = (userData) => {
    if (userData) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }
        if (userData.email) {
            localStorage.setItem('userEmail', userData.email);
        }
        if (userData.name) {
            localStorage.setItem('userName', userData.name);
        }
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch (e) {
        return false;
    }
};

// Get user role
export const getUserRole = () => {
    const user = getCurrentUser();
    return user?.role || localStorage.getItem('userRole') || null;
};

// Get user email
export const getUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || localStorage.getItem('userEmail') || null;
};

// Get user name
export const getUserName = () => {
    const user = getCurrentUser();
    return user?.name || localStorage.getItem('userName') || 'User';
};

// Login function to handle authentication
export const login = (token, userData) => {
    setToken(token);
    setCurrentUser(userData);
};

// Logout function to clear all auth data
export const logout = () => {
    // Call logout API if needed
    const token = getToken();
    if (token) {
        // You might want to make an API call to invalidate the token on the server
        // This is optional and depends on your backend implementation
        // api.post('/auth/logout', {}).catch(console.error);
    }
    
    // Clear all auth data from storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
};

// Get authorization header for API calls
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Check if user has required role(s)
export const hasRole = (roles) => {
    const userRole = getUserRole();
    if (!userRole) return false;
    
    // If roles is a string, convert it to an array
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user has any of the required roles
    return requiredRoles.some(role => 
        userRole.toLowerCase() === role.toLowerCase()
    );
};

// Check if token is expired
export const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < (Date.now() + TOKEN_EXPIRY_BUFFER);
    } catch (e) {
        return true; // If there's an error, assume token is expired
    }
};

// Refresh the access token
// Note: This assumes your backend has a /auth/refresh endpoint
// that accepts a refresh token and returns a new access token
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const { authApi } = await import('../services/api');
        const response = await authApi.refreshToken({ refreshToken });
        
        if (response.data.token) {
            setToken(response.data.token);
            if (response.data.refreshToken) {
                localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
            }
            return response.data;
        }
        
        throw new Error('Failed to refresh token');
    } catch (error) {
        logout();
        throw error;
    }
};

// Get token, refreshing it if necessary
export const getValidToken = async () => {
    let token = getToken();
    
    if (token && isTokenExpired(token)) {
        try {
            const newToken = await refreshToken();
            token = newToken.token || token;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }
    
    return token;
};

// Higher-order function for role-based route protection
export const withRole = (allowedRoles) => (WrappedComponent) => {
    return (props) => {
        const userRole = getUserRole();
        const hasAccess = hasRole(allowedRoles);
        
        if (!isAuthenticated()) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return null;
        }
        
        if (!hasAccess) {
            // Redirect to unauthorized or dashboard if user doesn't have required role
            window.location.href = '/unauthorized';
            return null;
        }
        
        return <WrappedComponent {...props} />;
    };
};
