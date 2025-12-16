import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Authentication Middleware
// Verifies JWT tokens and protects routes

export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};
