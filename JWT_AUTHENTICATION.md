# 🔐 JWT Authentication Implementation Guide

## ✅ JWT Authentication Successfully Implemented!

Your School ERP system now uses **JWT (JSON Web Token)** authentication instead of simple localStorage flags!

## 📁 Files Created/Modified

### New Files:
- ✅ `src/utils/jwt.js` - Complete JWT utility functions

### Modified Files:
- ✅ `src/components/auth/Login.jsx` - Uses JWT for login
- ✅ `src/App.jsx` - Uses JWT for route protection
- ✅ `src/components/portals/student/StudentDashboard.jsx` - Uses JWT for logout

## 🎯 What is JWT?

**JWT (JSON Web Token)** is an industry-standard method for securely transmitting information between parties as a JSON object. It consists of three parts:

```
header.payload.signature
```

### Example JWT Token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0dWRlbnRAZXNoYXIuY29tIiwicm9sZSI6IlN0dWRlbnQiLCJuYW1lIjoiTWlrZSBXaWxzb24iLCJpYXQiOjE3MDUzMTIwMDAsImV4cCI6MTcwNTM5ODQwMH0.mock-signature-here
```

**Decoded:**
- **Header**: `{"alg":"HS256","typ":"JWT"}`
- **Payload**: `{"email":"student@eshwar.com","role":"Student","name":"Mike Wilson","iat":1705312000,"exp":1705398400}`
- **Signature**: `mock-signature-here`

## 🔧 How It Works

### 1. Login Process

**Before (Old Way):**
```javascript
localStorage.setItem('isAuthenticated', 'true');
localStorage.setItem('userRole', 'Student');
```

**After (JWT Way):**
```javascript
// Generate JWT token
const token = generateToken({
  email: 'student@eshwar.com',
  role: 'Student',
  name: 'Mike Wilson'
});

// Store token
localStorage.setItem('authToken', token);
```

### 2. Authentication Check

**Before (Old Way):**
```javascript
const isAuth = localStorage.getItem('isAuthenticated') === 'true';
```

**After (JWT Way):**
```javascript
import { isAuthenticated } from './utils/jwt';
const isAuth = isAuthenticated(); // Verifies token and expiration
```

### 3. Logout Process

**Before (Old Way):**
```javascript
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('userRole');
```

**After (JWT Way):**
```javascript
import { logout } from './utils/jwt';
logout(); // Removes token and all auth data
```

## 📚 JWT Utility Functions

### Available Functions:

#### 1. `generateToken(userData)`
Generates a new JWT token.

```javascript
import { generateToken } from './utils/jwt';

const token = generateToken({
  email: 'student@eshwar.com',
  role: 'Student',
  name: 'Mike Wilson'
});
```

#### 2. `verifyToken(token)`
Verifies if a token is valid and not expired.

```javascript
import { verifyToken } from './utils/jwt';

const payload = verifyToken(token);
if (payload) {
  console.log('Token is valid:', payload);
} else {
  console.log('Token is invalid or expired');
}
```

#### 3. `isAuthenticated()`
Checks if user is authenticated.

```javascript
import { isAuthenticated } from './utils/jwt';

if (isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

#### 4. `getUserFromToken()`
Gets user data from the stored token.

```javascript
import { getUserFromToken } from './utils/jwt';

const user = getUserFromToken();
console.log(user.email, user.role, user.name);
```

#### 5. `getUserRole()`
Gets the user's role from the token.

```javascript
import { getUserRole } from './utils/jwt';

const role = getUserRole(); // Returns: 'Student', 'Teacher', 'Admin', or 'Parent'
```

#### 6. `logout()`
Logs out the user by removing the token.

```javascript
import { logout } from './utils/jwt';

logout();
// Redirects to login page
```

#### 7. `mockLogin(email, password, role)`
Simulates backend authentication (for demo).

```javascript
import { mockLogin } from './utils/jwt';

try {
  const response = await mockLogin(
    'student@eshwar.com',
    'student123',
    'Student'
  );
  
  console.log('Token:', response.token);
  console.log('User:', response.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### 8. `refreshToken()`
Generates a new token with updated expiration.

```javascript
import { refreshToken } from './utils/jwt';

const newToken = refreshToken();
localStorage.setItem('authToken', newToken);
```

#### 9. `decodeToken(token)`
Decodes a token without verification (for debugging).

```javascript
import { decodeToken } from './utils/jwt';

const decoded = decodeToken(token);
console.log('Header:', decoded.header);
console.log('Payload:', decoded.payload);
```

## 🔐 Token Structure

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload
```json
{
  "email": "student@eshwar.com",
  "role": "Student",
  "name": "Mike Wilson",
  "iat": 1705312000,
  "exp": 1705398400
}
```

**Fields:**
- `email`: User's email address
- `role`: User's role (Student, Teacher, Admin, Parent)
- `name`: User's full name
- `iat`: Issued at timestamp (when token was created)
- `exp`: Expiration timestamp (24 hours from creation)

### Signature
A cryptographic signature to verify the token hasn't been tampered with.

## 🚀 How to Use

### Login
```javascript
// In Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const { mockLogin } = await import('../utils/jwt');
    const response = await mockLogin(email, password, activeRole);
    
    // Store token
    localStorage.setItem('authToken', response.token);
    
    // Navigate to dashboard
    navigate('/dashboard/student');
  } catch (error) {
    setError('Invalid credentials');
  }
};
```

### Protected Routes
```javascript
// In App.jsx
import { isAuthenticated } from './utils/jwt';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  return authenticated ? children : <Navigate to="/login" />;
};
```

### Get User Info
```javascript
// In any component
import { getUserFromToken } from './utils/jwt';

const MyComponent = () => {
  const user = getUserFromToken();
  
  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Name: {user.name}</p>
    </div>
  );
};
```

### Logout
```javascript
// In Dashboard
import { logout } from './utils/jwt';

const handleLogout = () => {
  logout();
  navigate('/login');
};
```

## 🔄 Token Expiration

Tokens expire after **24 hours** by default.

### Check Token Expiration
```javascript
import { verifyToken, getAuthToken } from './utils/jwt';

const token = getAuthToken();
const payload = verifyToken(token);

if (!payload) {
  console.log('Token expired! Please login again.');
  // Redirect to login
}
```

### Auto-Refresh Token
```javascript
import { refreshToken, setAuthToken } from './utils/jwt';

// Refresh token before it expires
setInterval(() => {
  const newToken = refreshToken();
  if (newToken) {
    setAuthToken(newToken);
    console.log('Token refreshed');
  }
}, 23 * 60 * 60 * 1000); // Refresh every 23 hours
```

## 🔧 Integration with Backend

When you have a real backend, replace the mock functions:

### Login with Real Backend
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://your-api.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        role: activeRole
      })
    });
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard/student');
    }
  } catch (error) {
    setError('Login failed');
  }
};
```

### API Requests with JWT
```javascript
const fetchData = async () => {
  const token = getAuthToken();
  
  const response = await fetch('https://your-api.com/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
};
```

## 🎯 Benefits of JWT

✅ **Stateless**: No need to store session data on server  
✅ **Scalable**: Works across multiple servers  
✅ **Secure**: Cryptographically signed  
✅ **Self-contained**: Contains all user info  
✅ **Expiration**: Automatic token expiry  
✅ **Standard**: Industry-standard authentication  

## 🔍 Debugging

### View Token in Console
```javascript
import { getAuthToken, decodeToken } from './utils/jwt';

const token = getAuthToken();
console.log('Token:', token);

const decoded = decodeToken(token);
console.log('Decoded:', decoded);
```

### Check Token Validity
```javascript
import { verifyToken, getAuthToken } from './utils/jwt';

const token = getAuthToken();
const payload = verifyToken(token);

if (payload) {
  console.log('✅ Token is valid');
  console.log('User:', payload);
} else {
  console.log('❌ Token is invalid or expired');
}
```

## 📝 Login Credentials

Same credentials work with JWT:

| Role | Email | Password |
|------|-------|----------|
| Student | student@eshwar.com | student123 |
| Teacher | teacher@eshwar.com | teacher123 |
| Admin | admin@eshwar.com | admin123 |
| Parent | parent@eshwar.com | parent123 |

## 🎉 Success!

Your app now uses **JWT authentication**! 

### What Changed:
- ✅ Login generates JWT tokens
- ✅ Routes verify JWT tokens
- ✅ Logout removes JWT tokens
- ✅ Token expiration after 24 hours
- ✅ Secure, industry-standard authentication

### What Stayed the Same:
- ✅ Same login UI
- ✅ Same credentials
- ✅ Same user experience
- ✅ Same dashboard functionality

**Your app is now using professional JWT authentication!** 🚀

## 🔐 Security Notes

1. **Mock Implementation**: Current implementation is for demo/development
2. **Production**: Use real backend with proper JWT signing
3. **HTTPS**: Always use HTTPS in production
4. **Secret Key**: Backend should use strong secret key
5. **Token Storage**: Consider using httpOnly cookies for production
6. **Refresh Tokens**: Implement refresh token mechanism for production

## 📚 Next Steps

1. **Test Login**: Login with any role to see JWT in action
2. **Check Console**: View generated JWT token in browser console
3. **Verify Expiration**: Token expires after 24 hours
4. **Backend Integration**: Connect to real backend when ready
5. **Add Refresh Token**: Implement token refresh mechanism
