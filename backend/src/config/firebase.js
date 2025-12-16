import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
    try {
        // TODO: Replace with your Firebase Admin SDK credentials
        // You can either use a service account JSON file or environment variables

        // Option 1: Using service account file
        // const serviceAccount = require('./path-to-serviceAccountKey.json');
        // admin.initializeApp({
        //   credential: admin.credential.cert(serviceAccount)
        // });

        // Option 2: Using environment variables
        if (process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_PRIVATE_KEY &&
            process.env.FIREBASE_CLIENT_EMAIL) {

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                })
            });

            console.log('✅ Firebase Admin initialized successfully');
        } else {
            console.warn('⚠️  Firebase credentials not found in environment variables');
            console.warn('⚠️  Firebase Admin SDK not initialized');
        }
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error.message);
    }
};

// Get Firestore instance
const getFirestore = () => {
    return admin.firestore();
};

// Get Auth instance
const getAuth = () => {
    return admin.auth();
};

export { initializeFirebase, getFirestore, getAuth };
export default admin;
