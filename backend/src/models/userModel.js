import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../data/users.json');


const ensureDataDir = () => {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
};

class User {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.name = data.name || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    
    static _readUsers() {
        ensureDataDir();
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    
    static _writeUsers(users) {
        ensureDataDir();
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    }

    
    static async create(userData) {
        const users = this._readUsers();
        
        const id = userData.id || Math.random().toString(36).substr(2, 9);
        const newUser = new User({ ...userData, id });

        users.push(newUser);
        this._writeUsers(users);

        return newUser;
    }

    
    static findOne(query) {
        const users = this._readUsers();
        
        if (query.email) {
            return users.find(u => u.email === query.email);
        }
        return null;
    }

    
    static async findById(id) {
        const users = this._readUsers();
        return users.find(u => u.id === id);
    }
}

export default User;
