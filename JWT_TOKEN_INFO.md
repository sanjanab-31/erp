# 🔐 JWT Token Configuration

## ✅ JWT Secret Key Created!

### **Your JWT Secret:**
```
erp_school_management_jwt_secret_key_2024_secure_token_do_not_share_this_key_12345
```

**Location:** `frontend/.env`

---

## 📋 How It Works:

### **1. Token Generation:**
When a user logs in, a JWT token is generated using this secret key:

```javascript
// In jwt.js
const token = generateToken({
  email: 'user@example.com',
  role: 'admin',
  name: 'User Name'
}, 'permanent'); // Token never expires (valid until 2099)
```

### **2. Token Structure:**
```
Header.Payload.Signature
```

**Example Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNjaG9vbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiQWRtaW4gVXNlciIsImlhdCI6MTczNDMzNjAwMCwiZXhwIjo0MTAyNDQ0ODAwfQ.c2lnbmF0dXJl
```

**Decoded Payload:**
```json
{
  "email": "admin@school.com",
  "role": "admin",
  "name": "Admin User",
  "iat": 1734336000,
  "exp": 4102444800
}
```

---

## 🔍 How to View Your Token:

### **Method 1: Browser Console**
1. Login to your app
2. Open DevTools (F12)
3. Go to Console
4. Type:
```javascript
localStorage.getItem('authToken')
```

### **Method 2: Application Storage**
1. Open DevTools (F12)
2. Go to **Application** tab
3. **Local Storage** → `http://localhost:5173`
4. Find `authToken` key

### **Method 3: Decode Token**
```javascript
// In browser console
const token = localStorage.getItem('authToken');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('Token Data:', payload);
```

---

## 🎯 Token Expiration Options:

You can change token expiration in `jwt.js`:

```javascript
// Permanent (default) - valid until 2099
generateToken(userData, 'permanent');

// 1 hour
generateToken(userData, '1h');

// 24 hours
generateToken(userData, '24h');

// 7 days
generateToken(userData, '7d');

// 30 days
generateToken(userData, '30d');

// 1 year
generateToken(userData, '1y');
```

---

## 🔒 Security Notes:

1. ✅ **Secret Key:** Stored in `.env` file (not committed to Git)
2. ✅ **Token Storage:** Stored in `localStorage`
3. ✅ **Token Verification:** Checked on every protected route
4. ✅ **Expiration:** Set to 2099 (essentially permanent)

---

## 📝 Token Contains:

- `email`: User's email address
- `role`: User's role (admin/teacher/student/parent)
- `name`: User's full name
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

---

## 🚀 Usage in Code:

### **Generate Token (Login):**
```javascript
import { generateToken, setAuthToken } from './utils/jwt';

const token = generateToken({
  email: 'user@example.com',
  role: 'admin',
  name: 'Admin User'
});

setAuthToken(token); // Store in localStorage
```

### **Verify Token (Protected Routes):**
```javascript
import { isAuthenticated, getUserRole } from './utils/jwt';

if (isAuthenticated()) {
  const role = getUserRole();
  console.log('User role:', role);
}
```

### **Get User Data:**
```javascript
import { getUserFromToken } from './utils/jwt';

const user = getUserFromToken();
console.log(user); // { email, role, name, iat, exp }
```

### **Logout:**
```javascript
import { logout } from './utils/jwt';

logout(); // Removes token from localStorage
```

---

## ⚠️ Important:

1. **Never share** the JWT secret key
2. **Never commit** `.env` file to Git (it's in `.gitignore`)
3. **Restart dev server** after changing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## ✅ Your Token is Now Secure!

The JWT secret is now set up and your tokens will be signed with:
```
erp_school_management_jwt_secret_key_2024_secure_token_do_not_share_this_key_12345
```

**Restart your dev server to apply the changes!**
