import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { getAuth, getFirestore } from '../config/firebase.js';

// Secret key for JWT (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // 2. Find user in database (Firestore)
        // Note: We are searching by ID (which we don't have) or Query. 
        // Since User model uses ID, we need to query by email.
        // For now, let's assume we can query Firestore users collection.
        // Ideally, we should use Firebase Auth UID, but here we are implementing custom auth.

        // Simulating finding user - In real app, query firestore: collection('users').where('email', '==', email)
        // For this implementation, we will try to use Firebase Auth if we can, 
        // but sticking to the custom JWT plan:

        // Access firestore directly for custom user storage
        const db = getFirestore();
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 4. Generate JWT token
        const token = jwt.sign(
            { id: userDoc.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 5. Return user data and token
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: userDoc.id,
                    email: user.email,
                    role: user.role,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

export const register = async (req, res) => {
    try {
        const { email, password, role, name } = req.body;

        // 1. Validate input data
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const db = getFirestore();
        const usersRef = db.collection('users');

        // 2. Check if user already exists
        const snapshot = await usersRef.where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user in database
        const newUser = {
            email,
            password: hashedPassword, // Storing hashed password
            role,
            name: name || '',
            createdAt: new Date().toISOString()
        };

        const docRef = await usersRef.add(newUser);

        // 5. Generate JWT token
        const token = jwt.sign(
            { id: docRef.id, email, role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: docRef.id,
                    email,
                    role,
                    name: newUser.name
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        // Client should delete the token on their side
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyToken = async (req, res) => {
    try {
        // If we reach here, middleware has already verified the token
        // and attached user to req.user

        // Fetch full user details if needed
        const db = getFirestore();
        const userDoc = await db.collection('users').doc(req.user.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userData = userDoc.data();
        // Exclude password
        delete userData.password;

        res.json({
            success: true,
            message: 'Token is valid',
            data: {
                user: { id: userDoc.id, ...userData }
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};
