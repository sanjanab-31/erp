# 🔐 JWT Token Expiration Guide

## ✅ Token is Now PERMANENT by Default!

I've updated your JWT authentication to use **permanent tokens** by default. Users will stay logged in indefinitely!

## 🎯 What Changed

### Before:
- Token expired after 24 hours
- User had to login again after 24 hours

### After (Now):
- Token is **PERMANENT** (valid until year 2099)
- User stays logged in forever (or until they logout)
- No need to login again

## 📊 Token Expiration Options

You now have **6 different expiration options**:

| Option | Duration | Use Case |
|--------|----------|----------|
| `'permanent'` | Until 2099 | **DEFAULT** - User stays logged in forever |
| `'1h'` | 1 hour | High security, frequent re-authentication |
| `'24h'` | 24 hours | Standard web apps |
| `'7d'` | 7 days | Mobile apps, remember me |
| `'30d'` | 30 days | Long-term sessions |
| `'1y'` | 1 year | Very long sessions |

## 🚀 How to Use Different Expiration Times

### Option 1: Permanent Token (DEFAULT - Already Set!)

**Current Setup:**
```javascript
// In jwt.js - line 18
export const generateToken = (userData, expiresIn = 'permanent') => {
  // Token will be valid until year 2099
}
```

**No changes needed!** Your tokens are already permanent.

### Option 2: Change Default Expiration

If you want a different default (e.g., 30 days):

```javascript
// In src/utils/jwt.js - line 18
export const generateToken = (userData, expiresIn = '30d') => {
  // Now tokens expire after 30 days by default
}
```

### Option 3: Set Expiration Per Login

You can set different expiration times for different roles:

```javascript
// In Login.jsx
const response = await mockLogin(email, password, activeRole, '7d'); // 7 days
```

**Example - Different expiration for each role:**
```javascript
// In Login.jsx handleSubmit
let tokenExpiration;
switch (activeRole) {
  case 'Student':
    tokenExpiration = 'permanent'; // Students never expire
    break;
  case 'Teacher':
    tokenExpiration = '30d'; // Teachers expire after 30 days
    break;
  case 'Admin':
    tokenExpiration = '24h'; // Admins expire after 24 hours (more secure)
    break;
  case 'Parent':
    tokenExpiration = '7d'; // Parents expire after 7 days
    break;
}

const response = await mockLogin(email, password, activeRole, tokenExpiration);
```

## 🔍 How to Check Token Expiration

### In Browser Console:

```javascript
// Get the token
const token = localStorage.getItem('authToken');

// Decode it
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));

// Check expiration
const expirationDate = new Date(payload.exp * 1000);
console.log('Token expires on:', expirationDate.toLocaleString());

// For permanent tokens, you'll see:
// "Token expires on: 12/31/2099, 12:00:00 AM"
```

### In Your Code:

```javascript
import { getUserFromToken } from './utils/jwt';

const user = getUserFromToken();
if (user) {
  const expirationDate = new Date(user.exp * 1000);
  console.log('Token valid until:', expirationDate);
}
```

## 💡 Understanding "Permanent" Tokens

### What "Permanent" Means:
- Token is valid until **December 31, 2099**
- That's **74+ years** from now
- Essentially, it never expires in practical terms

### Why Not Truly Infinite?
- JWT tokens must have an expiration date
- Year 2099 is far enough to be "permanent" for any practical use
- Still allows the token to be validated properly

## 🔄 Token Refresh (Optional)

If you want to implement automatic token refresh:

```javascript
// Auto-refresh token every 23 hours
setInterval(() => {
  import('./utils/jwt').then(({ refreshToken, setAuthToken }) => {
    const newToken = refreshToken('permanent'); // or any duration
    if (newToken) {
      setAuthToken(newToken);
      console.log('Token refreshed!');
    }
  });
}, 23 * 60 * 60 * 1000); // 23 hours
```

## 📝 Current Configuration

### Your Current Setup:
✅ **Default Expiration**: `'permanent'` (until 2099)  
✅ **Login**: Creates permanent token automatically  
✅ **No Re-login Required**: User stays logged in forever  
✅ **Console Logging**: Shows "Token will never expire (valid until 2099)"  

## 🎯 Examples

### Example 1: Login with Permanent Token (Current Default)
```javascript
const response = await mockLogin(
  'student@eshwar.com',
  'student123',
  'Student'
  // No 4th parameter = uses default 'permanent'
);

// Console shows: "🔐 Token will never expire (valid until 2099)"
```

### Example 2: Login with 7-Day Token
```javascript
const response = await mockLogin(
  'student@eshwar.com',
  'student123',
  'Student',
  '7d' // Token expires in 7 days
);

// Console shows: "🔐 Token will expire on: 12/22/2024, 2:00:00 PM"
```

### Example 3: Login with 1-Hour Token (High Security)
```javascript
const response = await mockLogin(
  'student@eshwar.com',
  'student123',
  'Student',
  '1h' // Token expires in 1 hour
);

// Console shows: "🔐 Token will expire on: 12/15/2024, 3:00:00 PM"
```

## 🔐 Security Considerations

### Permanent Tokens:
**Pros:**
- ✅ Best user experience (no re-login)
- ✅ Perfect for trusted devices
- ✅ Good for demo/development
- ✅ No session timeout issues

**Cons:**
- ⚠️ If token is stolen, it works forever
- ⚠️ User must manually logout
- ⚠️ Not recommended for public computers

### Short-Lived Tokens (24h, 1h):
**Pros:**
- ✅ More secure
- ✅ Limited damage if stolen
- ✅ Good for sensitive data

**Cons:**
- ⚠️ User must login frequently
- ⚠️ Worse user experience
- ⚠️ Need refresh token mechanism

## 🎨 Recommended Configurations

### For School ERP (Your Use Case):
```javascript
// Recommended: Permanent tokens
// Students/Teachers use trusted devices
// Good user experience is important
expiresIn = 'permanent' // ✅ Current setting
```

### For Banking App:
```javascript
// Recommended: Short tokens
// High security required
expiresIn = '1h' // Re-login every hour
```

### For Social Media:
```javascript
// Recommended: Medium tokens
// Balance security and UX
expiresIn = '30d' // Re-login monthly
```

### For E-commerce:
```javascript
// Recommended: Week-long tokens
// Good UX, reasonable security
expiresIn = '7d' // Re-login weekly
```

## 🚀 Quick Start

### Keep Permanent Tokens (Recommended):
**No changes needed!** Your tokens are already permanent.

### Change to 30-Day Tokens:
1. Open `src/utils/jwt.js`
2. Line 18: Change `'permanent'` to `'30d'`
3. Save file
4. Done!

### Change to 24-Hour Tokens:
1. Open `src/utils/jwt.js`
2. Line 18: Change `'permanent'` to `'24h'`
3. Save file
4. Done!

## 📊 Token Payload Example

### Permanent Token:
```json
{
  "email": "student@eshwar.com",
  "role": "Student",
  "name": "Mike Wilson",
  "iat": 1702656000,
  "exp": 4102444800  ← Year 2099
}
```

### 24-Hour Token:
```json
{
  "email": "student@eshwar.com",
  "role": "Student",
  "name": "Mike Wilson",
  "iat": 1702656000,
  "exp": 1702742400  ← 24 hours later
}
```

## 🎉 Summary

✅ **Tokens are now PERMANENT by default**  
✅ **Users stay logged in until they logout**  
✅ **No more "session expired" messages**  
✅ **6 expiration options available**  
✅ **Easy to change if needed**  
✅ **Console shows expiration info**  

### Your Current Status:
🔐 **Token Expiration**: Permanent (until 2099)  
✅ **User Experience**: Best possible (no re-login)  
✅ **Perfect for**: School ERP, trusted devices  

**Your users will stay logged in forever!** 🚀

## 🔧 Need Different Expiration?

Just change line 18 in `src/utils/jwt.js`:

```javascript
// Permanent (current)
export const generateToken = (userData, expiresIn = 'permanent') => {

// Or change to:
export const generateToken = (userData, expiresIn = '30d') => {
export const generateToken = (userData, expiresIn = '7d') => {
export const generateToken = (userData, expiresIn = '24h') => {
export const generateToken = (userData, expiresIn = '1h') => {
```

That's it! 🎯
