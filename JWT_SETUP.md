# JWT Configuration Guide

## 🔐 JWT Secret Key Setup

This project uses environment variables to securely store the JWT secret key.

### Files Created:

1. **`.env`** - Your actual secret key (NEVER commit this to Git)
2. **`.env.example`** - Template file for other developers
3. **Updated `.gitignore`** - Ensures `.env` is never committed

---

## 📁 Environment Variables

### Current Configuration:

```env
VITE_JWT_SECRET=erp_school_management_2025_secure_key_a8f3d9c2e1b7f4a6d8c3e9b1f2a5d7c4
VITE_APP_NAME=School ERP System
VITE_TOKEN_EXPIRY=permanent
```

### How to Access in Code:

```javascript
// Vite automatically loads .env files
const secret = import.meta.env.VITE_JWT_SECRET;
```

---

## 🚀 Setup Instructions

### For First Time Setup:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your secret key:**
   ```env
   VITE_JWT_SECRET=your_unique_secret_key_here
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

### For Team Members:

1. Ask the project admin for the `.env` file
2. Place it in the root directory
3. Never commit it to Git

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` in `.gitignore`
- Use strong, random secret keys
- Rotate keys periodically
- Use different keys for dev/staging/production
- Store production keys in secure vaults (AWS Secrets Manager, Azure Key Vault, etc.)

### ❌ DON'T:
- Commit `.env` to version control
- Share secret keys in chat/email
- Use simple or predictable keys
- Hardcode secrets in your code
- Use the same key across environments

---

## 🔑 Generating a Secure Secret Key

### Option 1: Using Node.js
```javascript
require('crypto').randomBytes(64).toString('hex')
```

### Option 2: Using OpenSSL
```bash
openssl rand -hex 64
```

### Option 3: Online Generator
Use a trusted generator like: https://randomkeygen.com/

---

## 📝 Current Implementation

### Location: `src/utils/jwt.js`

The JWT utility now:
1. ✅ Reads secret from `import.meta.env.VITE_JWT_SECRET`
2. ✅ Falls back to a default key with a warning if not found
3. ✅ Uses the secret for token signing

### Example:
```javascript
const getJWTSecret = () => {
    const secret = import.meta.env.VITE_JWT_SECRET;
    if (!secret) {
        console.warn('⚠️ VITE_JWT_SECRET not found in .env file');
        return 'default-insecure-key-change-this';
    }
    return secret;
};
```

---

## ⚠️ Important Notes

### Current Limitations:

1. **Frontend JWT Generation** - This is a mock implementation for development
2. **Not Cryptographically Secure** - Uses base64 encoding, not HMAC-SHA256
3. **Production Ready?** - NO! For production, move JWT generation to the backend

### For Production:

Consider implementing:
- Backend API for authentication
- Proper JWT library (`jsonwebtoken` for Node.js)
- HTTPS only
- Refresh tokens
- Token blacklisting
- Rate limiting

---

## 🛠️ Troubleshooting

### Issue: "VITE_JWT_SECRET not found" warning

**Solution:**
1. Check if `.env` file exists in root directory
2. Ensure variable name is exactly `VITE_JWT_SECRET`
3. Restart the dev server after creating/editing `.env`

### Issue: Changes to `.env` not reflecting

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

---

## 📞 Support

For questions about JWT configuration, contact the development team.

**Last Updated:** December 15, 2025
