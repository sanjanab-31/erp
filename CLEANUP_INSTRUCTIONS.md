# Data Cleanup Instructions

This guide will help you clear all mock data and local storage from the ERP system.

## 🗄️ Clear Database (MongoDB)

### Method 1: Using NPM Script (Recommended)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Run the cleanup script:
   ```bash
   npm run clear-db
   ```

This will:
- Connect to your MongoDB database
- Delete all documents from all collections
- Show a summary of what was cleared

### Method 2: Using MongoDB Compass or CLI

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to your database
3. For each collection, click "Delete" → "Delete all documents"

**Using MongoDB CLI:**
```bash
mongosh "your-connection-string"
use your-database-name
db.dropDatabase()
```

---

## 🌐 Clear Browser Local Storage

### Method 1: Using the Cleanup Page

1. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173/clear-storage.html
   ```

3. Click "Clear All Data" button

4. Confirm the action

### Method 2: Using Browser DevTools

**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Go to "Application" tab
3. In the left sidebar, expand "Local Storage"
4. Right-click on your site URL
5. Click "Clear"

**Firefox:**
1. Press `F12` to open DevTools
2. Go to "Storage" tab
3. Right-click "Local Storage"
4. Click "Delete All"

### Method 3: Using Browser Console

1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Type and press Enter:
   ```javascript
   localStorage.clear(); sessionStorage.clear(); location.reload();
   ```

---

## 🔄 Complete System Reset

To completely reset the system:

1. **Clear the database:**
   ```bash
   cd backend
   npm run clear-db
   ```

2. **Clear browser storage:**
   - Visit `http://localhost:5173/clear-storage.html`
   - Click "Clear All Data"

3. **Restart the backend server:**
   ```bash
   npm run dev
   ```

4. **Refresh the frontend:**
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or clear browser cache

---

## 📋 What Gets Cleared

### Database (MongoDB):
- ✅ Users
- ✅ Students
- ✅ Teachers
- ✅ Parents
- ✅ Courses
- ✅ Assignments
- ✅ Submissions
- ✅ Exams
- ✅ Attendance records
- ✅ Fee records
- ✅ Library books and issues
- ✅ Announcements
- ✅ Timetables
- ✅ All other collections

### Local Storage:
- ✅ Authentication tokens
- ✅ User session data
- ✅ User role information
- ✅ User email and name
- ✅ Current user object
- ✅ All cached preferences

---

## ⚠️ Important Notes

1. **Backup First**: If you have any important data, export it before clearing
2. **Cannot Undo**: Once cleared, data cannot be recovered
3. **Re-login Required**: After clearing, you'll need to create new accounts or login again
4. **Environment Variables**: Your `.env` files are NOT affected by this cleanup

---

## 🆘 Troubleshooting

**Database won't clear:**
- Check if MongoDB is running
- Verify `MONGO_URL` in your `.env` file
- Check database connection permissions

**Local storage won't clear:**
- Try using browser DevTools method
- Check if browser has storage permissions
- Try in incognito/private mode

**Still seeing old data:**
- Hard refresh the browser (`Ctrl+Shift+R`)
- Clear browser cache
- Restart the development server
