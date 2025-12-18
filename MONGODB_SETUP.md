# MongoDB Local Setup Guide

## ✅ Current Configuration

Your `.env` file has been updated to use local MongoDB:

```env
MONGO_URL=mongodb://localhost:27017/erp
```

## 🔍 MongoDB Status

MongoDB service is **RUNNING** on your system.

## 🚀 Quick Start

1. **Test the connection:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Clear the database:**
   ```bash
   npm run clear-db
   ```

## 📊 Database Information

- **Host:** localhost
- **Port:** 27017
- **Database Name:** erp
- **Connection String:** `mongodb://localhost:27017/erp`

## 🛠️ MongoDB Management Tools

### Option 1: MongoDB Compass (GUI)
1. Download from: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `erp`

### Option 2: MongoDB Shell (CLI)
```bash
# Connect to MongoDB
mongosh

# Switch to erp database
use erp

# Show all collections
show collections

# View data in a collection
db.users.find()

# Clear a collection
db.users.deleteMany({})

# Drop entire database
db.dropDatabase()
```

## 🔄 Switching Between Local and Atlas

### Use Local MongoDB:
```env
MONGO_URL=mongodb://localhost:27017/erp
```

### Use MongoDB Atlas:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/erp
```

## ⚠️ Troubleshooting

### MongoDB Service Not Running
```powershell
# Start MongoDB service
net start MongoDB

# Check service status
Get-Service MongoDB
```

### Connection Refused
1. Check if MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```

2. Check if port 27017 is open:
   ```powershell
   netstat -an | findstr "27017"
   ```

3. Restart MongoDB service:
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

### Cannot Find MongoDB
If MongoDB is not in PATH, find the installation directory:
```powershell
Get-Service MongoDB | Select-Object -ExpandProperty BinaryPathName
```

## 📝 Notes

- Local MongoDB doesn't require internet connection
- No IP whitelist restrictions
- Faster for development
- Data is stored on your local machine
- Remember to backup important data before clearing

## 🎯 Next Steps

1. ✅ MongoDB configured to use localhost
2. ✅ MongoDB service is running
3. 🔄 Restart your backend server
4. 🧪 Test the connection
5. 🗑️ Run `npm run clear-db` to clear old data
