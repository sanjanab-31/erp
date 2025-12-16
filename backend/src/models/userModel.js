import { getFirestore } from '../config/firebase.js';

const db = getFirestore();
const usersCollection = db.collection('users');

class User {
    constructor(data) {
        this.email = data.email;
        this.role = data.role;
        this.name = data.name || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = new Date();
    }

    // Create a new user in Firestore
    static async create(uid, userData) {
        try {
            const user = new User(userData);
            await usersCollection.doc(uid).set({
                ...user,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
            return { uid, ...user };
        } catch (error) {
            throw error;
        }
    }

    // Find user by ID
    static async findById(uid) {
        try {
            const doc = await usersCollection.doc(uid).get();
            if (!doc.exists) return null;
            return { uid: doc.id, ...doc.data() };
        } catch (error) {
            throw error;
        }
    }

    // Update user
    static async update(uid, data) {
        try {
            await usersCollection.doc(uid).update({
                ...data,
                updatedAt: new Date()
            });
            return await this.findById(uid);
        } catch (error) {
            throw error;
        }
    }
}

export default User;
